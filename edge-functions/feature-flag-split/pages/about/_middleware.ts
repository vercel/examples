import { NextRequest, NextResponse } from 'next/server'
import { getTreatment } from '@lib/split-node'
import { SPLITS } from '@lib/split'

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()

  // Redirect paths that go directly to the variant
  if (url.pathname != '/about') {
    url.pathname = '/about'
    return NextResponse.redirect(url)
  }

  const flagName = `flag-${SPLITS.NEW_ABOUT_PAGE}`
  const cookie =
    req.cookies[flagName] ||
    (getTreatment('anonymous', SPLITS.NEW_ABOUT_PAGE) === 'on' ? '1' : '0')

  url.pathname = cookie === '1' ? '/about/b' : '/about'

  const res = NextResponse.rewrite(url)

  // Add the cookie if it's not there
  if (!req.cookies[flagName]) {
    res.cookie(flagName, cookie)
  }

  return res
}
