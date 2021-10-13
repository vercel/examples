import { NextResponse, NextFetchEvent } from 'next/server'
import { createTokenRateLimit } from '@lib/api/keys'
import increment from '@lib/increment'

// Does rate limiting based on a bearer token, or by
// IP address if there's no token.
const rateLimit = createTokenRateLimit({
  countFunction: increment,
  limit: 5,
  timeframe: 10,
})

export function middleware(evt: NextFetchEvent) {
  if (evt.request.nextUrl.pathname === '/api') {
    return evt.respondWith(handler(evt))
  }
  evt.respondWith(NextResponse.next())
}

async function handler(evt: NextFetchEvent) {
  const response = await rateLimit(evt.request)
  if (response) return response

  return new Response(JSON.stringify({ done: true }), {
    status: 200,
    headers: {
      ...Object.fromEntries(evt.request.headers),
      'Content-Type': 'application/json',
    },
  })
}
