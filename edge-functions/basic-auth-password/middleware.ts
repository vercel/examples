/* eslint-disable @next/next/no-server-import-in-page */
import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname !== '/') {
    return
  }

  const basicAuth = req.headers.get('authorization')
  const url = req.nextUrl.clone()

  if (basicAuth) {
    const auth = basicAuth.split(' ')[1]
    const [user, pwd] = atob(auth).split(':')

    if (user === '4dmin' && pwd === 'testpwd123') {
      return NextResponse.next()
    }
  }
  url.pathname = `/auth`

  return NextResponse.rewrite(url)
}
