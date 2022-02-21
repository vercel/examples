import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { blockedIp } from '@lib/rules/ip'

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()

  // Rewrite to /blocked if the IP is blocked
  if (url.pathname === '/am-i-blocked') {
    if (await blockedIp(req)) {
      url.pathname = '/blocked'
      return NextResponse.rewrite(url)
    }
    return NextResponse.next()
  }

  // Trying to access the /blocked page manually is disallowed
  if (url.pathname === '/blocked') {
    return new Response(null, { status: 404 })
  }
}
