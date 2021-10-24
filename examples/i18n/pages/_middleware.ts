import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/

export function middleware(req: NextRequest) {
  const country = req.geo.country?.toLowerCase() || 'us'
  const locale = req.headers.get('accept-language')?.split(',')?.[0] || 'en-US'

  // Only rewrite files that don't have a file extension
  if (!PUBLIC_FILE.test(req.nextUrl.pathname)) {
    req.nextUrl.pathname = `/${locale}/${country}`
    return NextResponse.rewrite(req.nextUrl)
  }
}
