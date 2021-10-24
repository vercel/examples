import { NextFetchEvent, NextResponse } from 'next/server'

const allowedParams = ['allowed']

export function middleware(ev: NextFetchEvent) {
  const url = ev.request.nextUrl
  let changed = false

  url.searchParams.forEach((_, key) => {
    if (!allowedParams.includes(key)) {
      url.searchParams.delete(key)
      changed = true
    }
  })

  // Avoid infinite loop by only redirecting if the query
  // params were changed
  if (changed) {
    ev.respondWith(NextResponse.redirect(url))
    // It's also useful to do a rewrite instead of a redirect
    // ev.respondWith(NextResponse.rewrite(url))
  }
}
