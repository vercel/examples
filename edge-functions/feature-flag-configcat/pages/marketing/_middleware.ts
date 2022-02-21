import { NextRequest, NextResponse } from 'next/server'
import { getValue } from '@lib/configcat'

const COOKIE_NAME = 'flag-newMarketingPage'

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()

  // Redirect paths that go directly to the variant
  if (url.pathname != '/marketing') {
    url.pathname = '/marketing'
    return NextResponse.redirect(url)
  }

  const cookie =
    req.cookies[COOKIE_NAME] || (getValue('newMarketingPage') ? '1' : '0')

  url.pathname = cookie === '1' ? '/marketing/b' : '/marketing'

  const res = NextResponse.rewrite(url)

  // Add the cookie if it's not there
  if (!req.cookies[COOKIE_NAME]) {
    res.cookie(COOKIE_NAME, cookie)
  }

  return res
}
