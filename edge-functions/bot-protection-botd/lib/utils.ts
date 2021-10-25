import { NextFetchEvent, NextResponse } from 'next/server'

type Middleware = (
  event: NextFetchEvent
) => Response | void | Promise<Response | void>

/**
 * Composes async middlewares from left to right. Execution
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
