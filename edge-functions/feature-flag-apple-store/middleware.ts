import { NextRequest, NextResponse } from 'next/server'
import get from 'lib/redis'

export async function middleware(req: NextRequest) {
  if (await get('store-closed')) {
    const url = req.nextUrl.clone()
    url.pathname = `/_closed`
    return NextResponse.rewrite(url)
  }
}
