import { NextResponse, NextRequest } from 'next/server'

export default function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  if (url.pathname === '/') {
    url.pathname = '/news/1'
    return NextResponse.rewrite(url)
  }
}
