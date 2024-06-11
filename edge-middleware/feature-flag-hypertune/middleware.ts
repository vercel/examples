import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import { unstable_precompute as precompute } from '@vercel/flags/next'
import getHypertune from './lib/getHypertune'
import precomputeFlags from './lib/precomputeFlags'

export const config = {
  matcher: '/static',
}

export async function middleware(
  request: NextRequest,
  context: NextFetchEvent
) {
  const hypertune = await getHypertune(request)

  const exampleFlag = hypertune.exampleFlag({ fallback: false })
  console.log('Middleware Example Flag:', exampleFlag)

  // precompute returns a string encoding each flag's returned value
  const code = await precompute(precomputeFlags)

  // rewrites the request to include the precomputed code for this flag combination
  const nextUrl = new URL(
    `/static/${code}${request.nextUrl.search}`,
    request.url
  )

  context.waitUntil(hypertune.flushLogs())

  return NextResponse.rewrite(nextUrl, { request })
}
