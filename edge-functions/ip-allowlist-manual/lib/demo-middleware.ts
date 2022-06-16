// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from 'next/server'

/**
 * Demo setup wrapper
 */
export default function demoMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Page without DataDome enabled
  if (pathname === '/omit') return NextResponse.next()

  // Force the page to be blocked by DataDome
  if (pathname === '/blocked') {
    req.headers.set('user-agent', 'BLOCKUA')
  }
}
