import { NextRequest, NextResponse } from 'next/server'
import { get } from 'lib/feature-flags'

export const config = {
  matcher: '/',
}

export async function middleware(req: NextRequest) {
  if (await get('storeClosed')) {
    req.nextUrl.pathname = `/_closed`
    return NextResponse.rewrite(req.nextUrl)
  }
}
