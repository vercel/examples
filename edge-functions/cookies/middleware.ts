import { NextRequest, NextResponse } from 'next/server'

export const config = {
  pathname: '/',
}

export function middleware(req: NextRequest) {
  // Clone URL
  const url = req.nextUrl.clone()

  // Only rewrite requests to `/`, as _middleware on the `/pages` root will be executed in every request of the app.
  if (url.pathname !== '/') return NextResponse.next()

  // Parse the cookie
  const isInBeta = JSON.parse(req.cookies.get('beta') || 'false')

  // Update url pathname
  url.pathname = `/${isInBeta ? 'beta' : 'non-beta'}`

  // Rewrite to url
  return NextResponse.rewrite(url)
}
