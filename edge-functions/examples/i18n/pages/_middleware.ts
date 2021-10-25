import { NextFetchEvent, NextResponse } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/

export function middleware(ev: NextFetchEvent) {
  const country = ev.request.geo.country?.toLowerCase() || 'us'
  const locale =
    ev.request.headers.get('accept-language')?.split(',')?.[0] || 'en-US'

  // Only rewrite files that don't have a file extension
  if (!PUBLIC_FILE.test(ev.request.nextUrl.pathname)) {
    ev.request.nextUrl.pathname = `/${locale}/${country}`
    ev.respondWith(NextResponse.rewrite(ev.request.nextUrl))
  }
}
