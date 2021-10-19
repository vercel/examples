/**
 * List of utils we might have been finding useful while
 * building the demos.
 * Note: We might not want to use this utils in demos
 * for now to avoid magic, but it'll be nice to see if
 * something here could be published eventually
 */

import { NextFetchEvent, NextResponse } from 'next/server'

type Middleware = (
  event: NextFetchEvent
) => Response | void | Promise<Response | void>

type ComposedMiddleware = (
  event: NextFetchEvent,
  res?: NextResponse
) => NextResponse | void | Promise<NextResponse | void>

/**
 * Composes middlewares from left to right.
 *
 * `event.respondWith` is called at the start to allow
 * each middleware to be async so it can't be called
 * in the middlewares
 */
export function sequence(...args: ComposedMiddleware[]) {
  return (event: NextFetchEvent) => {
    event.respondWith(handler(event))
  }

  async function handler(event: NextFetchEvent) {
    let res: NextResponse | undefined

    for await (const middleware of args) {
      res = (await middleware(event, res)) ?? undefined
    }

    return res ?? NextResponse.next()
  }
}

/**
 * Composes middlewares from left to right. Execution
 * stops with the first middleware that returns a response
 *
 * `event.respondWith` is called at the start to allow
 * each middleware to be async so it can't be called
 * in the middlewares
 */
export function first(...args: Middleware[]) {
  return (event: NextFetchEvent) => {
    event.respondWith(handler(event))
  }

  async function handler(event: NextFetchEvent) {
    for await (const middleware of args) {
      const res = await middleware(event)
      if (res) return res
    }
    return NextResponse.next()
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
