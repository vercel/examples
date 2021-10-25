import { NextFetchEvent, NextResponse } from 'next/server'
import redirects from '@lib/redirects'

export function middleware(ev: NextFetchEvent) {
  ev.respondWith(handler(ev))
}

async function handler(ev: NextFetchEvent) {
  return (await redirects(ev.request)) || NextResponse.next()
}
