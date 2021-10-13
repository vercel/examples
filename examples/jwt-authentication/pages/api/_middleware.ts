import type { NextFetchEvent } from 'next/server'
import { NextResponse } from 'next/server'
import { handleAuth } from '@lib/auth'

export function middleware(event: NextFetchEvent) {
  const url = event.request.nextUrl
  if (url.searchParams.has('edge')) {
    console.log('Edge Auth', url.toString())
    return event.respondWith(handleAuth(event))
  }
  
  console.log('Lambda Auth:', url.toString())
  return event.respondWith(NextResponse.next())
}
