import type { NextFetchEvent, NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/

async function logPageView(req: NextRequest) {
  // ignore static assets from being tracked,
  if (
    // process.env.NODE_ENV !== 'production' || // uncomment this line to track only production requests
    PUBLIC_FILE.test(req.nextUrl.pathname)
  ) {
    return
  }

  //  you can track extra information such as req.geo, req.userAgent, req.headers, etc.
  const body = JSON.stringify({
    slug: req.nextUrl.pathname,
  })

  const request = await fetch(process.env.SUPABASE_URL + '/rest/v1/analytics', {
    headers: {
      apikey: process.env.SUPABASE_ANON_KEY!,
      'Content-Type': 'application/json',
    },
    body,
    method: 'POST',
  })

  if (request.status !== 201) {
    console.error('Error logging analytics: ', body)
  }

  return
}

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  const response = NextResponse.next()

  logPageView(req)
  return response
}
