import { NextRequest, NextResponse } from 'next/server'
import { init } from '@launchdarkly/vercel-server-sdk'
import { createClient } from '@vercel/edge-config'
import {
  UID_COOKIE,
  EXPERIMENT_FLAG_KEY,
  FALLBACK_BUCKET,
  BUCKETS,
  type Bucket,
} from './lib/constants'

const IS_UUID = /^[0-9a-f-]+$/i

const edgeConfigClient = createClient(process.env.EDGE_CONFIG)

export const config = {
  matcher: '/',
}

export async function middleware(req: NextRequest) {
  let userId = req.cookies.get(UID_COOKIE)?.value
  let hasUserId = !!userId

  if (!userId || !IS_UUID.test(userId)) {
    userId = crypto.randomUUID()
    hasUserId = false
  }

  let bucket: string = FALLBACK_BUCKET

  try {
    // Create a fresh LaunchDarkly client per request to avoid shared promise issues
    // across requests in Edge Middleware (unlike Edge Functions, cache() is not available)
    const ldClient = init(
      process.env.NEXT_PUBLIC_LD_CLIENT_SIDE_ID!,
      edgeConfigClient
    )
    await ldClient.waitForInitialization()

    const context = { kind: 'user', key: userId }
    const flagValue = await ldClient.variation(
      EXPERIMENT_FLAG_KEY,
      context,
      FALLBACK_BUCKET
    )

    // Validate the returned value is a known bucket to avoid rewriting to a missing route
    if (typeof flagValue === 'string' && BUCKETS.includes(flagValue as Bucket)) {
      bucket = flagValue
    }
  } catch {
    // Fall back to the default bucket if LaunchDarkly fails
    bucket = FALLBACK_BUCKET
  }

  const url = req.nextUrl.clone()
  url.pathname = `/${bucket}`
  const res = NextResponse.rewrite(url)

  if (!hasUserId) {
    res.cookies.set(UID_COOKIE, userId, {
      maxAge: 60 * 60 * 24,
    })
  }

  return res
}
