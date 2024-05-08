import { NextRequest, NextResponse, NextFetchEvent } from 'next/server'
import Statsig from 'statsig-node'
import { EdgeConfigDataAdapter } from 'statsig-node-vercel'
import { createClient } from '@vercel/edge-config'
import { EXPERIMENT, UID_COOKIE, GROUP_PARAM_FALLBACK } from './lib/constants'

// We'll use this to validate a random UUID
const IS_UUID = /^[0-9a-f-]+$/i

const edgeConfigClient = createClient(process.env.EDGE_CONFIG)
const dataAdapter = new EdgeConfigDataAdapter({
  edgeConfigClient,
  edgeConfigItemKey: process.env.EDGE_CONFIG_ITEM_KEY!,
})

export const config = {
  matcher: '/',
}

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  // Get the user ID from the cookie or get a new one
  let userId = req.cookies.get(UID_COOKIE)?.value
  let hasUserId = !!userId

  // If there's no active user ID in cookies or its value is invalid, get a new one
  if (!userId || !IS_UUID.test(userId)) {
    userId = crypto.randomUUID()
    hasUserId = false
  }

  await Statsig.initialize(process.env.STATSIG_SERVER_API_KEY!, {
    dataAdapter,
    // 🚨 It's extremly important to set this, otherwise Statsig will attempt
    // to fetch the ID List over the network, which is slow and would render
    // using the Edge Config Adapter useless.
    //
    // If you are not using the ID List feature, set this to "none".
    //
    // Otherwise consider setting it to "lazy" but be aware of the consequences
    // that the ID List will not apply in most cases as it will only get fetched
    // after the experiment ran
    initStrategyForIDLists: 'lazy',
    // 🚨 This setting will prevent Statsig from making any network requests,
    // thus ensuring middleware stays extremly fast.
    localMode: true,
  })

  const experiment = Statsig.getExperimentSync({ userID: userId }, EXPERIMENT)
  const bucket = experiment.get<string>('bucket', GROUP_PARAM_FALLBACK)

  // Clone the URL and change its pathname to point to a bucket
  const url = req.nextUrl.clone()
  url.pathname = `/${bucket}`

  // Response that'll rewrite to the selected bucket
  const res = NextResponse.rewrite(url)

  // Add the user ID to the response cookies if it's not there or if its value was invalid
  if (!hasUserId) {
    res.cookies.set(UID_COOKIE, userId, {
      maxAge: 60 * 60 * 24, // identify users for 24 hours
    })
  }

  // Flush exposure logs to Statsig
  // Disabled as we activated localMode. Turn localMode off if you need to log
  // exposures from here.
  // event.waitUntil(Statsig.flush())

  return res
}
