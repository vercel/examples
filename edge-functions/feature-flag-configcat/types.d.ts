// eslint-disable-next-line @next/next/no-server-import-in-page
import type { NextFetchEvent, NextRequest } from 'next/server'

declare interface Middleware {
  path: string
  fn: (
    request: NextRequest,
    event: NextFetchEvent
  ) => Response | Promise<Response | undefined> | undefined
}
