import { NextRequest, NextResponse } from 'next/server'
import { get } from '@vercel/edge-config'

export const config = {
  matcher: '/big-promo',
}

export async function middleware(req: NextRequest) {
  // Check whether the maintenance page should be shown
  const isInMaintenanceMode = await get<boolean>('isInMaintenanceMode')

  // If is in maintenance mode, point the url pathname to the maintenance page
  if (isInMaintenanceMode) {
    req.nextUrl.pathname = `/maintenance`

    // Rewrite to the url
    return NextResponse.rewrite(req.nextUrl)
  }
}
