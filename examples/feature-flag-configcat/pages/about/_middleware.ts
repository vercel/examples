import { NextFetchEvent, NextResponse } from 'next/server'
import { getValue } from '@lib/configcat'

const COOKIE_NAME = 'flag-newAboutPage'

export function middleware(ev: NextFetchEvent) {
  // Redirect paths that go directly to the variant
  if (ev.request.nextUrl.pathname != '/about') {
    return ev.respondWith(NextResponse.redirect('/about'))
  }

  const cookie =
    ev.request.cookies[COOKIE_NAME] || (getValue('newAboutPage') ? '1' : '0')
  const res = NextResponse.rewrite(cookie === '1' ? '/about/b' : '/about')

  // Add the cookie if it's not there
  if (!ev.request.cookies[COOKIE_NAME]) {
    res.cookie(COOKIE_NAME, cookie)
  }

  return ev.respondWith(res)
}
