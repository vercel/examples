import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/internal')) {
    return NextResponse.rewrite(new URL('/', request.url))
  }
}

// Supports both a single string value or an array of matchers
export const config = {
  matcher: ['/internal/:path*'],
}
