// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from 'next/server'
import { get } from 'lib/upstash-redis'

export const config = {
  matcher: '/',
}

export async function middleware(request: NextRequest) {
  if (await get('store-closed')) {
    const url = new URL(request.url)
    url.pathname = `/_closed`
    return NextResponse.rewrite(url)
  }
}
