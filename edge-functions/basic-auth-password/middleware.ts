import { NextRequest, NextResponse } from 'next/server'

// limit middleware to only home page
export const config = {
  matcher: '/',
}

export function middleware(req: NextRequest) {
  const authValue = req.headers.get('authorization')
  const url = req.nextUrl

  if (authValue) {
    const auth = authValue.split(' ')[1]
    const [user, pwd] = atob(auth).split(':')

    if (user === '4dmin' && pwd === 'testpwd123') {
      return NextResponse.next()
    }
  }
  url.pathname = `api/auth`

  return NextResponse.rewrite(url)
}
