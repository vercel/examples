import { NextRequest, NextResponse } from 'next/server'

// Set pathname were middleware will be executed
export const config = {
  pathname: '/edge',
}

export function middleware(req: NextRequest) {
  // Clone URL
  const url = req.nextUrl.clone()

  // Skip unwanted paths
  if (url.pathname !== '/edge') return NextResponse.next()

  // Get country
  const country = req.geo.country?.toLowerCase() || 'us'

  // Update pathname
  url.pathname = `/edge/${country}`

  // Rewrite to URL
  return NextResponse.rewrite(url)
}
