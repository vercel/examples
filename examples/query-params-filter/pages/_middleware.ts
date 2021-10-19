import { NextFetchEvent, NextResponse } from 'next/server'

const allowedParams = ['allowed']

export function middleware(ev: NextFetchEvent) {
  const url = ev.request.nextUrl

  url.searchParams.forEach((_, key) => {
    if (!allowedParams.includes(key)) {
      url.searchParams.delete(key)
    }
  })

  ev.respondWith(NextResponse.rewrite(url))
}
