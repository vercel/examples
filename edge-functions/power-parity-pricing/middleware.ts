import { NextRequest, NextResponse } from 'next/server'

// Set a path matcher
const PATH_MATCHER = new RegExp(/\/[a-z]{2}$/g)

// Set pathname were middleware will be executed
export const config = {
  pathname: '/',
}

export function middleware(req: NextRequest) {
  // Clone URL
  const url = req.nextUrl.clone()

  // Skip unwanted paths
  if (PATH_MATCHER.test(url.pathname)) return NextResponse.next()

  // Get country
  const country = req.geo.country?.toLowerCase() || 'us'

  // Update pathname
  url.pathname = `/${country}`

  // Rewrite to URL
  return NextResponse.rewrite(url)
}
