import { NextRequest, NextResponse } from 'next/server'
import { get } from 'lib/upstash-redis'

export const config = {
  matcher: '/',
}

export async function middleware(req: NextRequest) {
  if (await get('store-closed')) {
    req.nextUrl.pathname = `/_closed`
    return NextResponse.rewrite(req.nextUrl)
  }
}
