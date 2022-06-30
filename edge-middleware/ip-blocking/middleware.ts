import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { blockedIp } from '@lib/rules/ip'

export const config = {
  matcher: ['/blocked', '/am-i-blocked'],
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl

  // Rewrite to /blocked if the IP is blocked
  if (url.pathname === '/am-i-blocked') {
    if (await blockedIp(req)) {
      url.pathname = '/blocked'
      return NextResponse.rewrite(url)
    }
    return
  }

  // Trying to access the /blocked page manually is disallowed
  if (url.pathname === '/blocked') {
    url.pathname = `/404`
    return NextResponse.rewrite(url)
  }
}
