import type { NextFetchEvent } from 'next/server'
import { NextResponse } from 'next/server'
import { blockedIp } from '@lib/rules/ip'

export function middleware(evt: NextFetchEvent) {
  // Rewrite to /blocked if the IP is blocked
  const url = evt.request.nextUrl
  if (url.pathname === '/am-i-blocked') {
    return evt.respondWith(blocked(evt))
  }

  // Trying to access the /blocked page manually is disallowed
  if (url.pathname === '/blocked') {
    return evt.respondWith(NextResponse.redirect('/'))
  }
}

async function blocked(evt: NextFetchEvent) {
  if (await blockedIp(evt)) {
    return NextResponse.rewrite('/blocked')
  }
  return NextResponse.next()
}
