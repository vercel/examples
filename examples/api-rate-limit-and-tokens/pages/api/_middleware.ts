import { tokenRateLimit } from '@lib/api/keys'
import { NextFetchEvent } from 'next/server'

export function middleware(evt: NextFetchEvent) {
  if (evt.request.nextUrl.pathname === '/api') {
    return evt.respondWith(handler(evt))
  }
}

async function handler(evt: NextFetchEvent) {
  const res = await tokenRateLimit(evt.request)
  if (res.status !== 200) return res

  res.headers.set('content-type', 'application/json')

  return new Response(JSON.stringify({ done: true }), {
    status: 200,
    headers: res.headers,
  })
}
