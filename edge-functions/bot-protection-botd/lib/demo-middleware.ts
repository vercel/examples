import { NextRequest, NextResponse } from 'next/server'
import botdProxy from './botd/proxy'

export default function demoMiddleware(req: NextRequest) {
  const res = botdProxy(req)
  if (res) return res

  const { pathname } = req.nextUrl

  // Page without Botd enabled
  if (pathname === '/omit') {
    return NextResponse.next()
  }

  // Force the page to be blocked by Botd
  if (pathname === '/blocked') {
    req.headers.set(
      'user-agent',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/90.0.4430.93 Safari/537.36'
    )
  }
}
