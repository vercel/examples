// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from 'next/server'
import { DISTINCT_ID_COOKIE_NAME, FEATURE_FLAGS } from '@lib/constants'
import { getFeatureFlagVariant, isFeatureFlagEnabled } from '@lib/posthog-node'

export const config = {
  matcher: ['/product(.*)', '/about(.*)', '/marketing(.*)'],
}

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  const response = new NextResponse()

  if (pathname.includes('/product')) {
    const productVariantValue = await getFeatureFlagVariant(
      req.cookies[DISTINCT_ID_COOKIE_NAME],
      FEATURE_FLAGS.NEW_PRODUCT_PAGE
    )

    console.log(productVariantValue)

    // Redirect path based on the variant value
    return response.rewrite(
      new URL(`/product/${productVariantValue}`, req.nextUrl)
    )
  }

  if (pathname.includes('/marketing')) {
    console.log('marketing')
    // Redirect paths that go directly to the variant
    if (pathname != '/marketing') {
      return NextResponse.redirect(new URL('/marketing', req.url))
    }

    const newMarketingPageFlagEnabled = await isFeatureFlagEnabled(
      req.cookies[DISTINCT_ID_COOKIE_NAME],
      FEATURE_FLAGS.NEW_MARKETING_PAGE
    )

    return NextResponse.rewrite(
      new URL(
        newMarketingPageFlagEnabled ? '/marketing/b' : '/marketing',
        req.url
      )
    )
  }

  if (pathname.includes('/about')) {
    console.log('about')

    // Redirect paths that go directly to the variant
    if (pathname != '/about') {
      return NextResponse.redirect(new URL('/about', req.url))
    }

    const newAboutPageFlagEnabled = await isFeatureFlagEnabled(
      req.cookies[DISTINCT_ID_COOKIE_NAME],
      FEATURE_FLAGS.NEW_ABOUT_PAGE
    )

    return NextResponse.rewrite(
      new URL(newAboutPageFlagEnabled ? '/about/b' : '/about', req.url)
    )
  }
}
