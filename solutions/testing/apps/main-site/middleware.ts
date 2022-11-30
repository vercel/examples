import { NextRequest, NextResponse } from 'next/server'
import db from './lib/db'

export const config = {
  matcher: ['/', '/signup'],
}

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl
  const user = await db.getUserFromReq(req)
  let redirectTo

  if (!user && url.pathname === '/') {
    redirectTo = '/signup'
  }
  if (user && url.pathname === '/signup') {
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
