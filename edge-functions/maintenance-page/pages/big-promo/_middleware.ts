import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  // Clone the URL
  const url = req.nextUrl.clone()

  // Simulate connection with a redis cache
  const isInMaintenanceMode = Math.random() >= 0.5

  // If is in maintenance mode, point the url pathname to the maintenance page
  if (isInMaintenanceMode) {
    url.pathname = `/maintenance`

    // Rewrite to the url
    return NextResponse.rewrite(url)
  }
}
