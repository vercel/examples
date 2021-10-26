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
  const { pathname } = req.nextUrl

  if (['/marketing', '/about'].includes(pathname)) {
    res = NextResponse.rewrite(
      // `0` is the original version
      variantId === '0' ? pathname : pathname.replace('/', `/${cookie}/`)
    )
  }

  // Add the cookie if it's not there
  if (!req.cookies[COOKIE_NAME]) {
    res.cookie(COOKIE_NAME, cookie)
  }

  return res
}
