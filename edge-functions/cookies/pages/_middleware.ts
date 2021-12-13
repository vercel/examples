import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  // Only rewrite requests to `/`, as _middleware on the `/pages` root will be executed in every request of the app.
  if (req.url === "/") {
    // Parse the cookie
    const isInBeta = JSON.parse(req.cookies['beta'] || 'false')

    // Rewrite to the correct page
    return NextResponse.rewrite(`/${isInBeta ? 'beta' : 'non-beta'}`)
  }
}
