import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: '/',
}

export function middleware(req: NextRequest) {
  const url = new URL(req.url)

  // Parse the cookie
  const isInBeta = JSON.parse(req.cookies.get('beta') || 'false')

  // Update url pathname
  url.pathname = `/${isInBeta ? 'beta' : 'non-beta'}`

  // Rewrite to url
  return NextResponse.rewrite(url)
}
