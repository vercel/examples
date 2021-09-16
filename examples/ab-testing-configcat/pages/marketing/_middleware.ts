import type { EdgeRequest, EdgeResponse } from 'next'
import { getValue } from '@lib/configcat'

export function middleware(req: EdgeRequest, res: EdgeResponse, next) {
  let cookie = req.cookies['flag-newMarketingPage']

  if (!cookie) {
    const value = getValue('newMarketingPage') ? '1' : '0'

    cookie = value
    res.cookie('flag-newMarketingPage', value)
  }

  if (req.url.pathname === '/marketing') {
    res.rewrite(cookie === '1' ? '/marketing/b' : '/marketing')
    return
  }

  next()
}
