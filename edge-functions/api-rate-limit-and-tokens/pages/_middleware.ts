import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { blockedIp } from '@lib/rules/ip'

export async function middleware(req: NextRequest) {
  // Rewrite to /blocked if the IP is blocked
  const url = req.nextUrl
  if (url.pathname === '/am-i-blocked') {
    return (await blockedIp(req))
      ? NextResponse.rewrite('/blocked')
      : NextResponse.next()
  }

  // Trying to access the /blocked page manually is disallowed
  if (url.pathname === '/blocked') {
    return new Response(null, { status: 404 })
  }
}
