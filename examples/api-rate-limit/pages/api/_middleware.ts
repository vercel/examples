import type { NextFetchEvent } from 'next/server'
import { ipRateLimit } from '@lib/ip-rate-limit'

export function middleware(ev: NextFetchEvent) {
  if (ev.request.nextUrl.pathname === '/api') {
    return ev.respondWith(handler(ev))
  }
}

async function handler(ev: NextFetchEvent) {
  const res = await ipRateLimit(ev.request)
  if (res.status !== 200) return res

  res.headers.set('content-type', 'application/json')

  return new Response(JSON.stringify({ done: true }), {
    status: 200,
    headers: res.headers,
  })
}
