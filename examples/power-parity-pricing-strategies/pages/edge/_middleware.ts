import { NextFetchEvent, NextResponse } from 'next/server'

export function middleware(ev: NextFetchEvent) {
  const req = ev.request
  let country = req.geo.country?.toLowerCase() || 'us'

  if (country.includes('-')) {
    country = country.split('-')[1].toLowerCase();
  }

  req.nextUrl.pathname = `/edge/${country}`
  ev.respondWith(NextResponse.rewrite(req.nextUrl))
}
