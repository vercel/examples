import { NextRequest, NextResponse } from 'next/server'
import db from './lib/db'

export const config = {
  matcher: ['/', '/signup'],
}

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl
  const user = await db.getUserFromReq(req)

  if (!user && url.pathname === '/') {
    req.nextUrl.pathname = '/signup'
    return NextResponse.redirect(req.nextUrl)
  }
  if (user && url.pathname === '/signup') {
    req.nextUrl.pathname = '/'
    return NextResponse.redirect(req.nextUrl)
  }
}
