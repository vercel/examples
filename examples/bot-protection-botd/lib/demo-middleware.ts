import type { EdgeRequest, EdgeResponse } from 'next'
import { botdEdge } from './botd'
import botdProxy from './botd/proxy'

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
    if (botdProxy(req, res)) return

    // Page without Botd enabled
    if (req.url?.pathname === '/omit') {
      return next()
    }

    // Force the page to be blocked by Botd
    if (req.url?.pathname === '/blocked') {
      req.headers.set(
        'user-agent',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/90.0.4430.93 Safari/537.36'
      )
    }

    return fn(req, res, next)
  }
}
