import { NextRequest, NextResponse } from 'next/server'
import get from 'lib/redis'

export async function middleware(req: NextRequest) {
  if (await get('store-closed')) {
    return NextResponse.rewrite(`/_closed`)
  }
}
