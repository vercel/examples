import { NextURL } from 'next/dist/server/web/next-url'
/* eslint-disable @next/next/no-server-import-in-page */
import { NextRequest, NextResponse } from 'next/server'

// limit middleware to only home page
export const config = {
  matcher: '/',
}

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization')

  if (basicAuth) {
    const auth = basicAuth.split(' ')[1]
    const [user, pwd] = atob(auth).split(':')

    if (user === '4dmin' && pwd === 'testpwd123') {
      return NextResponse.next()
    }
  }
  const url = new NextURL(req.nextUrl)
  url.pathname = '/auth'

  return NextResponse.rewrite(url)
}
