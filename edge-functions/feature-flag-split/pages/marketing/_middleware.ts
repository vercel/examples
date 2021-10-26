import { NextRequest, NextResponse } from 'next/server'
import { getTreatment } from '@lib/split-node'
import { SPLITS } from '@lib/split'

export function middleware(req: NextRequest) {
  // Redirect paths that go directly to the variant
  if (req.nextUrl.pathname != '/marketing') {
    return NextResponse.redirect('/marketing')
  }

  const flagName = `flag-${SPLITS.NEW_MARKETING_PAGE}`
  const cookie =
    req.cookies[flagName] ||
    (getTreatment('anonymous', SPLITS.NEW_MARKETING_PAGE) === 'on' ? '1' : '0')
  const res = NextResponse.rewrite(
    cookie === '1' ? '/marketing/b' : '/marketing'
  )

  // Add the cookie if it's not there
  if (!req.cookies[flagName]) {
    res.cookie(flagName, cookie)
  }

  return res
}
