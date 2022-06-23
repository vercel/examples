import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: '/',
}

export function middleware(request: NextRequest) {
  return NextResponse.rewrite(new URL(`/api/crypto`, request.url))
}
