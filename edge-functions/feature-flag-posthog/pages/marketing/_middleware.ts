import { NextRequest, NextResponse } from 'next/server'
import { isFeatureFlagEnabled } from '@lib/posthog-node'
import { DISTINCT_ID_COOKIE_NAME, FEATURE_FLAGS } from '@lib/constants'

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()

  // Redirect paths that go directly to the variant
  if (url.pathname != '/marketing') {
    url.pathname = '/marketing'
    return NextResponse.redirect(url)
  }

  const newMarketingPageFlagEnabled = await isFeatureFlagEnabled(
    req.cookies[DISTINCT_ID_COOKIE_NAME],
    FEATURE_FLAGS.NEW_MARKETING_PAGE
  )
  url.pathname = newMarketingPageFlagEnabled ? '/marketing/b' : '/marketing'

  return NextResponse.rewrite(url)
}
