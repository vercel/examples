import { NextRequest, NextResponse } from 'next/server'
import { getValue } from '@lib/configcat'

const COOKIE_NAME = 'flag-newMarketingPage'

export function middleware(req: NextRequest) {
  // Redirect paths that go directly to the variant
  if (req.nextUrl.pathname != '/marketing') {
    return NextResponse.redirect('/marketing')
  }

  const cookie =
    req.cookies[COOKIE_NAME] || (getValue('newMarketingPage') ? '1' : '0')
  const res = NextResponse.rewrite(
    cookie === '1' ? '/marketing/b' : '/marketing'
  )

  // Add the cookie if it's not there
  if (!req.cookies[COOKIE_NAME]) {
    res.cookie(COOKIE_NAME, cookie)
  }

  return res
}
