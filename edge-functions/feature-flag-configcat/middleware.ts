// eslint-disable-next-line @next/next/no-server-import-in-page
import { type NextRequest, NextResponse, NextFetchEvent } from 'next/server'
import type { Middleware } from './types'
import { getValue } from '@lib/configcat'

const middlewares: Middleware[] = [
  {
    path: '/marketing',
    fn: (req: NextRequest) => {
      const COOKIE_NAME = 'flag-newMarketingPage'
      const url = new URL(req.url)

      // Redirect paths that go directly to the variant
      if (url.pathname != '/marketing') {
        url.pathname = '/marketing'
        return NextResponse.redirect(url)
      }

      const cookie =
        req.cookies[COOKIE_NAME] || (getValue('newMarketingPage') ? '1' : '0')
      url.pathname = cookie === '1' ? '/marketing/b' : '/marketing'

      const res = NextResponse.rewrite(url)

      // Adding the cookie if it's not present
      if (!req.cookies[COOKIE_NAME]) {
        res.cookies.set(COOKIE_NAME, cookie)
      }

      return res
    },
  },
  {
    path: '/about',
    fn: (req: NextRequest) => {
      const COOKIE_NAME = 'flag-newAboutPage'
      const url = new URL(req.url)

      // Redirect paths that go directly to the variant
      if (url.pathname != '/about') {
        url.pathname = '/about'
        return NextResponse.redirect(url)
      }

      const cookie =
        req.cookies[COOKIE_NAME] || (getValue('newAboutPage') ? '1' : '0')

      url.pathname = cookie === '1' ? '/about/b' : '/about'

      const res = NextResponse.rewrite(url)

      // Add the cookie if it's not there
      if (!req.cookies[COOKIE_NAME]) {
        res.cookies.set(COOKIE_NAME, cookie)
      }

      return res
    },
  },
]

export const config = {
  matcher: middlewares.map(({ path }) => path), // This line assumes the path are strings and correclty set.
}

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  const { pathname } = new URL(request.nextUrl)

  for (const m of middlewares) {
    // We could add support for RegExp as well
    if (pathname.startsWith(m.path)) {
      return m.fn(request, event)
    }
  }
  return NextResponse.next()
}
