import { type NextRequest, NextResponse } from 'next/server'
import { type FlagsMatcher, getValue } from '@lib/configcat'

const FLAGS: FlagsMatcher = {
  '/about': {
    cookie: 'flag-newAboutPage',
    name: 'newAboutPage',
    rewrite: (enabled) => (enabled ? '/about/b' : '/about'),
  },
  '/marketing': {
    cookie: 'flag-newMarketingPage',
    name: 'newMarketingPage',
    rewrite: (enabled) => (enabled ? '/marketing/b' : '/marketing'),
  },
}

export const config = {
  matcher: ['/about', '/marketing'],
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const flag = FLAGS[pathname]

  if (!flag) return

  const value =
    req.cookies.get(flag.cookie) || (getValue(flag.name) ? '1' : '0')

  // Create a rewrite to the page matching the flag
  const res = NextResponse.rewrite(
    new URL(flag.rewrite(value === '1'), req.url)
  )

  // Add the cookie to the response if it's not present
  if (!req.cookies.has(flag.cookie)) {
    res.cookies.set(flag.cookie, value)
  }

  return res
}
