import { NextRequest, NextResponse } from 'next/server'
import { COOKIE_NAME } from '@lib/constants'
import { getCurrentExperiment } from '@lib/optimize'

export const config = {
  matcher: ['/marketing', '/about'],
}

export function middleware(req: NextRequest) {
  let cookie = req.cookies.get(COOKIE_NAME)?.value

  if (!cookie) {
    let n = Math.random() * 100
    const experiment = getCurrentExperiment()
    const variant = experiment.variants.find((v, i) => {
      if (v.weight >= n) return true
      n -= v.weight
    })

    cookie = `${experiment.id}.${variant.id}`
  }

  const [, variantId] = cookie.split('.')
  const url = req.nextUrl

  // `0` is the original version
  if (variantId !== '0') {
    url.pathname = url.pathname.replace('/', `/${cookie}/`)
  }

  const res = NextResponse.rewrite(url)

  // Add the cookie if it's not there
  if (!req.cookies.has(COOKIE_NAME)) {
    res.cookies.set(COOKIE_NAME, cookie)
  }

  return res
}
