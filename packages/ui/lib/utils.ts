/**
 * List of utils we might have been finding useful while
 * building the demos.
 * Note: We might not want to use this utils in demos
 * for now to avoid magic, but it'll be nice to see if
 * something here could be published eventually
 */

import type { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

type Middleware = (
  req: NextRequest,
  event: NextFetchEvent
) => Response | void | Promise<Response | void>

type ComposedMiddleware = (
  req: NextRequest,
  res: NextResponse | undefined,
  event: NextFetchEvent
) => NextResponse | void | Promise<NextResponse | void>

/**
 * Composes middlewares from left to right.
 */
export function sequence(...args: ComposedMiddleware[]) {
  return async function handler(req: NextRequest, event: NextFetchEvent) {
    let res: NextResponse | undefined

    for await (const middleware of args) {
      res = (await middleware(req, res, event)) ?? undefined
    }

    return res
  }
}

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

/**
 * Returns a Response object with a JSON body
 */
export function jsonResponse(status: number, data: any, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    ...init,
    status,
    headers: {
      ...init?.headers,
      'Content-Type': 'application/json',
    },
  })
}
