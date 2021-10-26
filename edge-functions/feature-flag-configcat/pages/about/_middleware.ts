import { NextRequest, NextResponse } from 'next/server'
import { getValue } from '@lib/configcat'

const COOKIE_NAME = 'flag-newAboutPage'

export function middleware(req: NextRequest) {
  // Redirect paths that go directly to the variant
  if (req.nextUrl.pathname != '/about') {
    return NextResponse.redirect('/about')
  }

  const cookie =
    req.cookies[COOKIE_NAME] || (getValue('newAboutPage') ? '1' : '0')
  const res = NextResponse.rewrite(cookie === '1' ? '/about/b' : '/about')

  // Add the cookie if it's not there
  if (!req.cookies[COOKIE_NAME]) {
    res.cookie(COOKIE_NAME, cookie)
  }

  return res
}
