import { NextResponse, NextRequest } from 'next/server'

export const config = {
  matcher: '/',
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl
  url.pathname = '/api/json'
  return NextResponse.rewrite(url)
}
