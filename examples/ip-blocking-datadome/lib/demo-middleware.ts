import type { EdgeRequest, EdgeResponse } from 'next'
import { DOMAINS } from '@lib/domains'

type MiddlewareFn = (
  req: EdgeRequest,
  res: EdgeResponse,
  next: any
) => any | Promise<any>

/**
 * Demo setup wrapper
 */
export default function demoMiddleware(fn: MiddlewareFn): MiddlewareFn {
  return async (req, res, next) => {
    const proxy = DOMAINS[req.url.pathname]

    // Proxy DataDome scripts so they don't get adblocked
    if (proxy) {
      return res.rewrite(proxy.src)
    }

    // Page without DataDome enabled
    if (req.url.pathname === '/omit') {
      return next()
    }

    // Force the page to be blocked by DataDome
    if (req.url.pathname === '/blocked') {
      req.headers.set('user-agent', 'BLOCKUA')
    }

    return fn(req, res, next)
  }
}
