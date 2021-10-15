import { tokenRateLimit } from '@lib/api/keys'
import { NextResponse, NextFetchEvent } from 'next/server'

export function middleware(evt: NextFetchEvent) {
  if (evt.request.nextUrl.pathname === '/api') {
    return evt.respondWith(handler(evt))
  }
  evt.respondWith(NextResponse.next())
}

async function handler(evt: NextFetchEvent) {
  const res = await tokenRateLimit(evt.request)
  if (res) return res

  return new Response(JSON.stringify({ done: true }), {
    status: 200,
    headers: {
      ...Object.fromEntries(evt.request.headers),
      'Content-Type': 'application/json',
    },
  })
}
