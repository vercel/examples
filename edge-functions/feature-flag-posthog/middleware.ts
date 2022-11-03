import { NextRequest, NextResponse } from 'next/server'
import { DISTINCT_ID_COOKIE_NAME, FLAGS } from '@lib/constants'
import { type FlagsMatcher, getFeatureFlagVariant } from '@lib/posthog-api'

const flagsByPath: FlagsMatcher = {
  '/product': {
    name: FLAGS.NEW_PRODUCT_PAGE,
    rewrite: (value) => (value ? '/product/a' : '/product'),
  },
  '/marketing': {
    name: FLAGS.NEW_MARKETING_PAGE,
    rewrite: (value) => (value ? '/marketing/b' : '/marketing'),
  },
  '/about': {
    name: FLAGS.NEW_ABOUT_PAGE,
    rewrite: (value) => (value ? '/about/b' : '/about'),
  },
}

export const config = {
  matcher: ['/product', '/about', '/marketing'],
}

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl
  const flag = flagsByPath[url.pathname]

  if (!flag) return

  const distinctUserID = req.cookies.get(DISTINCT_ID_COOKIE_NAME)?.value ?? '0'
  const variantValue = await getFeatureFlagVariant(distinctUserID, flag.name)

  url.pathname = flag.rewrite(variantValue)
  // Rewrite path based on the variant value or default to fallback
  return NextResponse.rewrite(url)
}
