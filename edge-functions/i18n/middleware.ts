import { NextRequest, NextResponse } from 'next/server'

// only run middleware on home page
export const config = {
  matcher: '/',
}

export default function middleware(req: NextRequest) {
  // req.geo is only available on pro and enterprise accounts
  const country = req.geo?.country?.toLowerCase() || 'us'
  const locale = req.headers.get('accept-language')?.split(',')?.[0] || 'en-US'

  // Only rewrite files that don't have a file extension
  req.nextUrl.pathname = `/${locale}/${country}`
  return NextResponse.rewrite(req.nextUrl)
}
