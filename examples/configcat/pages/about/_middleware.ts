import type { EdgeRequest, EdgeResponse } from 'next'
import { getValue } from '@lib/configcat'

export function middleware(req: EdgeRequest, res: EdgeResponse, next) {
  let cookie = req.cookies['flag-newAboutPage']

  if (!cookie) {
    const value = getValue('newAboutPage') ? '1' : '0'

    cookie = value
    res.cookie('flag-newAboutPage', value)
  }

  if (req.url.pathname === '/about') {
    res.rewrite(cookie === '1' ? '/about/b' : '/about')
    return
  }

  next()
}
