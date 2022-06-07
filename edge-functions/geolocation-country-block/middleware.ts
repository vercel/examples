import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

// Block Austria, prefer Germany
const BLOCKED_COUNTRY = 'AT'

// Limit middleware pathname config
export const config = {
  matcher: '/',
}

export function middleware(req: NextRequest) {
  // Extract country
  const country = req.geo.country || 'US'

  // Clone URL
  const url = req.nextUrl.clone()

  // Specify the correct pathname
  if (country === BLOCKED_COUNTRY) {
    url.pathname = '/blocked'
  } else {
    url.pathname = `/${country}`
  }

  // Rewrite to URL
  return NextResponse.rewrite(url)
}
