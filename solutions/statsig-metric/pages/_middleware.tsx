import { NextResponse, NextRequest } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/

export function middleware(req: NextRequest) {
  const response = NextResponse.next()

  // avoid public files such as images and api requests
  const isPageRequest =
    !PUBLIC_FILE.test(req.nextUrl.pathname) &&
    !req.nextUrl.pathname.startsWith('/api')

  // when a user visits a page we set a cookie to identify the user
  if (isPageRequest) {
    const userId = req.cookies['userId'] || crypto.randomUUID!()

    // if the user doesn't have a cookie we set one otherwise they are returning users
    if (!req.cookies['userId']) {
      response.cookie('userId', userId)
    }
  }

  // the response will go through unmodified as we just need to set the cookie
  return response
}
