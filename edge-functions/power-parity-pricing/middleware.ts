import { NextRequest, NextResponse } from 'next/server'

// Set pathname were middleware will be executed
export const config = {
  matcher: '/',
}

export function middleware(req: NextRequest) {
  // Get country
  const country = req.geo.country?.toLowerCase() || 'us'

  // Update pathname
  req.nextUrl.pathname = `/${country}`

  // Rewrite to URL
  return NextResponse.rewrite(req.nextUrl)
}
