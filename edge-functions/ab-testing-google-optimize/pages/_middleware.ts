import { NextRequest, NextResponse } from 'next/server'
import { COOKIE_NAME } from '@lib/constants'
import { getCurrentExperiment } from '@lib/optimize'

export function middleware(req: NextRequest) {
  let res = NextResponse.next()
  let cookie = req.cookies[COOKIE_NAME]

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
  const url = req.nextUrl.clone()

  if (['/marketing', '/about'].includes(url.pathname)) {
    // `0` is the original version
    if (variantId !== '0') {
      url.pathname = url.pathname.replace('/', `/${cookie}/`)
    }
    res = NextResponse.rewrite(url)
  }

  // Add the cookie if it's not there
  if (!req.cookies[COOKIE_NAME]) {
    res.cookie(COOKIE_NAME, cookie)
  }

  return res
}
