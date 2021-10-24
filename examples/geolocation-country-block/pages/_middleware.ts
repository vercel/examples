import type { NextRequest } from 'next/server'

// Block Austria, prefer Germany
const BLOCKED_COUNTRY = 'AT'

export function middleware(req: NextRequest) {
  const country = req.geo.country || 'US'

  if (country === BLOCKED_COUNTRY) {
    return new Response('Blocked for legal reasons', { status: 451 })
  }
  return new Response(`Greetings from ${country}, where you are not blocked.`)
}
