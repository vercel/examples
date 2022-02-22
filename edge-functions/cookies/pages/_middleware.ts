import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  // Only rewrite requests to `/`, as _middleware on the `/pages` root will be executed in every request of the app.
  if (url.pathname === '/') {
    // Parse the cookie
    const isInBeta = JSON.parse(req.cookies['beta'] || 'false')

    // Rewrite to the correct page
    url.pathname = `/${isInBeta ? 'beta' : 'non-beta'}`
    return NextResponse.rewrite(url)
  }
}
