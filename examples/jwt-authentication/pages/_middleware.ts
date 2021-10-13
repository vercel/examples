import type { NextFetchEvent } from 'next/server'
import { handleSetCookie } from '@lib/auth'

export function middleware(event: NextFetchEvent) {
  event.respondWith(handleSetCookie(event))
}
