import type { EdgeRequest, EdgeResponse } from 'next'
import {
  BOTD_DEFAULT_PATH,
  BOTD_DEFAULT_URL,
  BOTD_PROXY_API,
  BOTD_PROXY_JS,
} from './constants'

type Proxies = {
  [key: string]: (req: EdgeRequest) => Parameters<EdgeResponse['rewrite']>[0]
}

export const PROXIES: Proxies = {
  [BOTD_PROXY_JS]: () =>
    'https://cdn.jsdelivr.net/npm/@fpjs-incubator/botd-agent@0/dist/botd.min.js',
  [BOTD_PROXY_API + 'detect']: (req) =>
    `${BOTD_DEFAULT_URL}${BOTD_DEFAULT_PATH}detect${req.url?.search ?? ''}`,
}

/**
 * Proxy Botd scripts and browser calls
 * Note: We can't change headers when proxying, so for botd we're going to
 * their domain directly instead of using this proxy because we can't send
 * the `botd-client-ip` header
 */
export default function botdProxy(req: EdgeRequest, res: EdgeResponse) {
  const proxy = PROXIES[req.url?.pathname!]

  if (proxy) {
    res.rewrite(proxy(req))
    return true
  }
  return false
}
