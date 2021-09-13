import type { EdgeRequest, EdgeResponse } from 'next'
import { getTreatment } from '@lib/split-node'
import { SPLITS } from '@lib/split'

export async function middleware(req: EdgeRequest, res: EdgeResponse, next) {
  let flagName = `flag-${SPLITS.NEW_ABOUT_PAGE}`
  let cookie = req.cookies[flagName]

  if (!cookie) {
    const value =
      getTreatment('anonymous', SPLITS.NEW_ABOUT_PAGE) === 'on' ? '1' : '0'

    cookie = value
    res.cookie(flagName, value)
  }

  if (req.url.pathname === '/about') {
    // Tracking from the edge is also possible, but this increases latency
    // await track(SPLITS.NEW_ABOUT_PAGE, 'user', 'page_serve', null, {
    //   treatment: cookie === '1' ? 'on' : 'off',
    // })
    res.rewrite(cookie === '1' ? '/about/b' : '/about')
    return
  }

  next()
}
