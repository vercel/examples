import { NextFetchEvent, NextResponse } from 'next/server'
import get from 'lib/redis'

export function middleware(ev: NextFetchEvent) {
  ev.respondWith(handler(ev))
}

async function handler(ev: NextFetchEvent) {
  if (await get('store-closed')) {
    return NextResponse.rewrite(`/_closed`)
  }
  return NextResponse.next()
}
