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

export default function botdProxy(req: EdgeRequest, res: EdgeResponse) {
  const proxy = PROXIES[req.url?.pathname!]

  // Proxy Botd scripts and browser calls
  if (proxy) {
    res.rewrite(proxy(req))
    return true
  }
  return false
}
