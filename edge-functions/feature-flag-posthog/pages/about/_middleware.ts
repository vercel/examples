import { NextRequest, NextResponse } from 'next/server'
import { isFeatureFlagEnabled } from '@lib/posthog-node'
import { DISTINCT_ID_COOKIE_NAME, FEATURE_FLAGS } from '@lib/constants'

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()

  // Redirect paths that go directly to the variant
  if (url.pathname != '/about') {
    url.pathname = '/about'
    return NextResponse.redirect(url)
  }

  const newAboutPageFlagEnabled = await isFeatureFlagEnabled(
    req.cookies[DISTINCT_ID_COOKIE_NAME],
    FEATURE_FLAGS.NEW_ABOUT_PAGE
  )
  url.pathname = newAboutPageFlagEnabled ? '/about/b' : '/about'

  return NextResponse.rewrite(url)
}
