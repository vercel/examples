import type { NextRequest, NextFetchEvent } from 'next/server'

import { NextResponse } from 'next/server'

// Match only the index route
export const config = {
  matcher: ['/'],
}

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  // Store the response so we can modify its headers
  const response = NextResponse.next()

  // Set custom header
  response.headers.set('x-modified-edge', 'true')

  // Return the response
  return response
}
