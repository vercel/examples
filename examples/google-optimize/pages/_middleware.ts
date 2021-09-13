import type { EdgeRequest, EdgeResponse } from 'next'
import { COOKIE_NAME } from '@lib/constants'
import { getCurrentExperiment } from '@lib/optimize'

export async function middleware(req: EdgeRequest, res: EdgeResponse, next) {
  let cookie = req.cookies[COOKIE_NAME]

  if (!cookie) {
    let n = Math.random() * 100
    const experiment = getCurrentExperiment()
    const variant = experiment.variants.find((v, i) => {
      if (v.weight >= n) return true
      n -= v.weight
    })

    cookie = `${experiment.id}.${variant.id}`
    res.cookie(COOKIE_NAME, cookie)
  }

  const [, variantId] = cookie.split('.')
  const { pathname } = req.url

  if (['/marketing', '/about'].includes(pathname)) {
    res.rewrite(
      // `0` is the original version
      variantId === '0' ? pathname : pathname.replace('/', `/${cookie}/`)
    )
    return
  }

  // Disallow the use of the variant page outside the original path
  // NOTE: A simple check like this currently causes infinite redirects
  // if (req.url.page === '/[variant]/marketing') {
  //   res.redirect('/marketing')
  //   return
  // }

  next()
}
