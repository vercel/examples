import type { NextFetchEvent } from 'next/server'

// Block Austria, prefer Germany
const BLOCKED_COUNTRY = 'AT'

export function middleware(ev: NextFetchEvent) {
  const country = ev.request.geo.country || 'US'

  if (country === BLOCKED_COUNTRY) {
    ev.respondWith(new Response('Blocked for legal reasons', { status: 451 }))
  } else {
    ev.respondWith(
      new Response(`Greetings from ${country}, where you are not blocked.`)
    )
  }
}
