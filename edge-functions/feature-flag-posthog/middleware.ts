// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from 'next/server'
import { DISTINCT_ID_COOKIE_NAME, FEATURE_FLAGS } from '@lib/constants'
import { getFeatureFlagVariant, isFeatureFlagEnabled } from '@lib/posthog-node'

export const config = {
  matcher: ['/product', '/about', '/marketing'],
}

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl

  if (url.pathname.startsWith('/product')) {
    // Defaults to product
    url.pathname = '/product'
    if (url.pathname != '/product') {
      // Redirect paths that go directly to the variant
      return NextResponse.redirect(url)
    }

    const distinctUserID = req.cookies.get(DISTINCT_ID_COOKIE_NAME) ?? '0'
    const productVariantValue = await getFeatureFlagVariant(
      distinctUserID,
      FEATURE_FLAGS.NEW_PRODUCT_PAGE
    )

    if (productVariantValue != undefined) {
      url.pathname = `/product/${productVariantValue ? 'a' : 'b'}`
    }

    // Rewrite path based on the variant value or default to fallback
    return NextResponse.rewrite(url)
  }

  if (url.pathname.startsWith('/marketing')) {
    // Redirect paths that go directly to the variant
    if (url.pathname != '/marketing') {
      url.pathname = '/marketing'
      return NextResponse.redirect(url)
    }

    const distinctUserID = req.cookies.get(DISTINCT_ID_COOKIE_NAME) ?? '0'
    const newMarketingPageFlagEnabled = await isFeatureFlagEnabled(
      distinctUserID,
      FEATURE_FLAGS.NEW_MARKETING_PAGE
    )

    // Rewrite path based on the variant value
    url.pathname = newMarketingPageFlagEnabled ? '/marketing/b' : '/marketing'
    return NextResponse.rewrite(url)
  }

  if (url.pathname.startsWith('/about')) {
    // Redirect paths that go directly to the variant
    if (url.pathname != '/about') {
      url.pathname = '/about'
      return NextResponse.redirect(url)
    }

    const distinctUserID = req.cookies.get(DISTINCT_ID_COOKIE_NAME) ?? '0'
    const newAboutPageFlagEnabled = await isFeatureFlagEnabled(
      distinctUserID,
      FEATURE_FLAGS.NEW_ABOUT_PAGE
    )

    // Rewrite path based on the variant value
    url.pathname = newAboutPageFlagEnabled ? '/about/b' : '/about'
    return NextResponse.rewrite(url)
  }
}
