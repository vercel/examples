// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextResponse } from 'next/server'
// eslint-disable-next-line @next/next/no-server-import-in-page
import type { NextRequest } from 'next/server'

// ------------------
// Using Crypto with Edge Middleware
// ------------------

export const config = {
  matcher: '/',
}

export function middleware(request: NextRequest) {
  const token = crypto.randomUUID()
  const url = new URL(request.url)
  url.pathname = '/api/crypto'
  url.searchParams.set('token', token)
  return NextResponse.redirect(url)
}
