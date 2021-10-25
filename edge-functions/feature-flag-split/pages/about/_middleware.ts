import { NextFetchEvent, NextResponse } from 'next/server'
import { getTreatment } from '@lib/split-node'
import { SPLITS } from '@lib/split'

export function middleware(ev: NextFetchEvent) {
  // Redirect paths that go directly to the variant
  if (ev.request.nextUrl.pathname != '/about') {
    return ev.respondWith(NextResponse.redirect('/about'))
  }

  const flagName = `flag-${SPLITS.NEW_ABOUT_PAGE}`
  const cookie =
    ev.request.cookies[flagName] ||
    (getTreatment('anonymous', SPLITS.NEW_ABOUT_PAGE) === 'on' ? '1' : '0')
  const res = NextResponse.rewrite(cookie === '1' ? '/about/b' : '/about')

  // Add the cookie if it's not there
  if (!ev.request.cookies[flagName]) {
    res.cookie(flagName, cookie)
  }

  return ev.respondWith(res)
}
