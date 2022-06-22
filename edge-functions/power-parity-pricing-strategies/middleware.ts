import { NextRequest, NextResponse } from 'next/server'

// Set pathname were middleware will be executed
export const config = {
  matcher: '/edge',
}

export function middleware(req: NextRequest) {
  // Get country
  const country = req.geo.country?.toLowerCase() || 'us'

  // Update pathname
  req.nextUrl.pathname = `/edge/${country}`

  // Rewrite to URL
  return NextResponse.rewrite(req.nextUrl)
}
