import { NextFetchEvent, NextResponse } from 'next/server'

export function middleware(ev: NextFetchEvent) {
  const country = ev.request.geo.country?.toLowerCase() || 'us'
  const locale =
    ev.request.headers.get('accept-language')?.split(',')?.[0] || 'en-US'

  ev.request.nextUrl.pathname = `/${locale}/${country}`
  ev.respondWith(NextResponse.rewrite(ev.request.nextUrl))
}
