import { NextFetchEvent, NextResponse } from 'next/server'
import { setUserCookie } from '@lib/auth'

export function middleware(event: NextFetchEvent) {
  const response = NextResponse.next()
  // Add the user token to the response
  event.respondWith(setUserCookie(event.request, response))
}
