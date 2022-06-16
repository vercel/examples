// eslint-disable-next-line @next/next/no-server-import-in-page
import type { NextFetchEvent, NextRequest } from 'next/server'

type Middleware = (
  req: NextRequest,
  event: NextFetchEvent
) => Response | void | Promise<Response | void>

/**
 * Composes async middlewares from left to right. Execution
 * stops with the first middleware that returns a response
 */
export function first(...args: Middleware[]) {
  return async function handler(req: NextRequest, event: NextFetchEvent) {
    for await (const middleware of args) {
      const res = await middleware(req, event)
      if (res) return res
    }
  }
}
