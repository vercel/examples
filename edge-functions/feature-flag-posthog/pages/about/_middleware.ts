import { NextRequest, NextResponse } from 'next/server'
import { isFeatureFlagEnabled } from '@lib/posthog-node'
import { DISTINCT_ID_COOKIE_NAME, FEATURE_FLAGS } from '@lib/constants'

export async function middleware(req: NextRequest) {
  // Redirect paths that go directly to the variant
  if (req.nextUrl.pathname != '/about') {
    return NextResponse.redirect('/about')
  }

  const newAboutPageFlagEnabled = await isFeatureFlagEnabled(
    req.cookies[DISTINCT_ID_COOKIE_NAME],
    FEATURE_FLAGS.NEW_ABOUT_PAGE
  )
  const res = NextResponse.rewrite(
    newAboutPageFlagEnabled ? '/about/b' : '/about'
  )

  return res
}
