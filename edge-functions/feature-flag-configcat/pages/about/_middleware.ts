import { NextRequest, NextResponse } from 'next/server'
import { getValue } from '@lib/configcat'

const COOKIE_NAME = 'flag-newAboutPage'

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()

  // Redirect paths that go directly to the variant
  if (url.pathname != '/about') {
    url.pathname = '/about'
    return NextResponse.redirect(url)
  }

  const cookie =
    req.cookies[COOKIE_NAME] || (getValue('newAboutPage') ? '1' : '0')

  url.pathname = cookie === '1' ? '/about/b' : '/about'

  const res = NextResponse.rewrite(url)

  // Add the cookie if it's not there
  if (!req.cookies[COOKIE_NAME]) {
    res.cookie(COOKIE_NAME, cookie)
  }

  return res
}
