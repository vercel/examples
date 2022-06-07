import { NextRequest, NextResponse } from 'next/server'

// Set pathname were middleware will be executed
export const config = {
  matcher: '/',
}

export function middleware(req: NextRequest) {
  // Clone URL
  const url = req.nextUrl.clone()

  // Get country
  const country = req.geo.country?.toLowerCase() || 'us'

  // Update pathname
  url.pathname = `/${country}`

  // Rewrite to URL
  return NextResponse.rewrite(url)
}
