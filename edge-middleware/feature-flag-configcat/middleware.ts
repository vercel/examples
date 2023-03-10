import { type NextRequest, NextResponse } from 'next/server'
import { type FlagsMatcher, getValue, type Flags } from '@lib/configcat'

const FLAGS: FlagsMatcher = {
  '/about': {
    cookie: 'flag-newAboutPage',
    name: process.env.FEATURE_FLAG_ABOUT_PAGE as Flags,
    rewrite: (enabled) => (enabled ? '/about/b' : '/about'),
  },
  '/marketing': {
    cookie: 'flag-newMarketingPage',
    name: process.env.FEATURE_FLAG_MARKETING_PAGE as Flags,
    rewrite: (enabled) => (enabled ? '/marketing/b' : '/marketing'),
  },
}

export const config = {
  matcher: ['/about', '/marketing'],
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl
  const flag = FLAGS[url.pathname]

  if (!flag) return

  const value =
    req.cookies.get(flag.cookie)?.value || (getValue(flag.name) ? '1' : '0')

  // Create a rewrite to the page matching the flag
  url.pathname = flag.rewrite(value === '1')
  const res = NextResponse.rewrite(url)

  // Add the cookie to the response if it's not present
  if (!req.cookies.has(flag.cookie)) {
    res.cookies.set(flag.cookie, value)
  }

  return res
}
