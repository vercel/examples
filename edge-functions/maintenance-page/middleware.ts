import { NextRequest, NextResponse } from 'next/server'

// Set pathname were middleware will be executed
export const config = {
  pathname: '/big-promo',
}

export async function middleware(req: NextRequest) {
  // Clone the URL
  const url = req.nextUrl.clone()

  // Filter unwanted paths
  if (url.pathname !== '/big-promo') return NextResponse.next()

  // Simulate connection with a redis cache
  const isInMaintenanceMode = Math.random() >= 0.5

  // If is in maintenance mode, point the url pathname to the maintenance page
  if (isInMaintenanceMode) {
    url.pathname = `/maintenance`

    // Rewrite to the url
    return NextResponse.rewrite(url)
  }
}
