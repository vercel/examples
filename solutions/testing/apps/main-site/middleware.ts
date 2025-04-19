import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromReq } from './lib/auth'

export const config = {
  matcher: ['/', '/signup', '/login'],
}

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl
  const userId = getUserIdFromReq(req)
  let redirectTo

  if (!userId && url.pathname === '/') {
    redirectTo = '/signup'
  }
  if (userId && (url.pathname === '/signup' || url.pathname === '/login')) {
    redirectTo = '/'
  }
  if (redirectTo) {
    req.nextUrl.pathname = redirectTo
    const res = NextResponse.redirect(req.nextUrl)
    // Don't cache the redirect so that we can redirect from '/signup'
    // to '/' in the browser with a client side transition
    res?.headers.set('x-middleware-cache', 'no-cache')
    return res
  }
}
