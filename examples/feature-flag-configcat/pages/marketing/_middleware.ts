import { NextFetchEvent, NextResponse } from 'next/server'
import { getValue } from '@lib/configcat'

const COOKIE_NAME = 'flag-newMarketingPage'

export function middleware(ev: NextFetchEvent) {
  // Redirect paths that go directly to the variant
  if (ev.request.nextUrl.pathname != '/marketing') {
    return ev.respondWith(NextResponse.redirect('/marketing'))
  }

  const cookie =
    ev.request.cookies[COOKIE_NAME] ||
    (getValue('newMarketingPage') ? '1' : '0')
  const res = NextResponse.rewrite(
    cookie === '1' ? '/marketing/b' : '/marketing'
  )

  // Add the cookie if it's not there
  if (!ev.request.cookies[COOKIE_NAME]) {
    res.cookie(COOKIE_NAME, cookie)
  }

  return ev.respondWith(res)
}
