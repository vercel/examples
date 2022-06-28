import { NextResponse, NextRequest } from 'next/server'

export const config = {
  matcher: '/',
}

export function middleware(req: NextRequest) {
  req.nextUrl.pathname = '/api/img'
  return NextResponse.rewrite(req.nextUrl)
}
