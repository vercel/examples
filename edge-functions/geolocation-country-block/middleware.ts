import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

// Block Austria, prefer Germany
const BLOCKED_COUNTRY = 'AT'

// Limit middleware pathname config
export const config = {
  pathname: '/',
}

export function middleware(req: NextRequest) {
  // Extract country
  const country = req.geo.country || 'US'

  // Clone URL
  const url = req.nextUrl.clone()

  // Only rewrite requests to `/`, as _middleware on the `/pages` root will be executed in every request of the app.
  if (url.pathname !== '/') return NextResponse.next()

  // Specify the correct pathname
  if (country === BLOCKED_COUNTRY) {
    url.pathname = '/blocked'
  } else {
    url.pathname = `/${country}`
  }

  // Rewrite to URL
  return NextResponse.rewrite(url)
}
