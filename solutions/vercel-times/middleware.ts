import { type NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: [
    /**
     * Matches a path like
     * /2023/01/27/world/europe/this-is-the-title.html
     * or
     * /2023/01/27/us/this-is-the-title.html
     */
    '/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:section([^/]+)/:slug+',
    // Articles don't have a date in the path
    '/article/:slug([^/]+)',
  ],
}

export function middleware(req: NextRequest) {
  return NextResponse.next()
}
