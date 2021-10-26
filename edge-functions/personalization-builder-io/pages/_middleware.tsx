import { NextFetchEvent, NextResponse } from 'next/server'
import { getPersonalizedRewrite } from '@builder.io/personalization-utils'

const excludededPrefixes = ['/favicon', '/api']

export default function middleware(event: NextFetchEvent) {
  const url = event.request.nextUrl
  let response = NextResponse.next()
  if (!excludededPrefixes.find((path) => url.pathname?.startsWith(path))) {
    const rewrite = getPersonalizedRewrite(
      url?.pathname!,
      event.request.cookies
    )
    if (rewrite) {
      response = NextResponse.rewrite(rewrite)
    }
  }
  event.respondWith(response)
}
