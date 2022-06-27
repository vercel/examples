// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextResponse } from 'next/server'

/**
 * Returns a Response object with a JSON body
 */
export function jsonResponse(status: number, data: any, init?: ResponseInit) {
  return new NextResponse(JSON.stringify(data), {
    ...init,
    status,
    headers: {
      ...init?.headers,
      'Content-Type': 'application/json',
    },
  })
}
