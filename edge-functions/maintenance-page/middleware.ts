import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: '/big-promo',
}

export async function middleware(req: NextRequest) {
  // Simulate connection with a redis cache
  const isInMaintenanceMode = Math.random() >= 0.5

  // If is in maintenance mode, point the url pathname to the maintenance page
  if (isInMaintenanceMode) {
    req.nextUrl.pathname = `/maintenance`

    // Rewrite to the url
    return NextResponse.rewrite(req.nextUrl)
  }
}
