import { NextFetchEvent, NextResponse } from 'next/server'

/**
 * Demo setup wrapper
 */
export default function demoMiddleware(ev: NextFetchEvent) {
  const { pathname } = ev.request.nextUrl

  // Page without DataDome enabled
  if (pathname === '/omit') {
    return NextResponse.next()
  }

  // Force the page to be blocked by DataDome
  if (pathname === '/blocked') {
    ev.request.headers.set('user-agent', 'BLOCKUA')
  }
}
