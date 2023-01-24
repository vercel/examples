import { NextRequest, NextResponse } from 'next/server'
import { get } from '@vercel/edge-config'

export const config = {
  matcher: ['/big-promo'],
}

export async function middleware(req: NextRequest) {
  if (!process.env.EDGE_CONFIG) {
    req.nextUrl.pathname = `/missing-edge-config`
    return NextResponse.rewrite(req.nextUrl)
  }

  try {
    // Check whether the maintenance page should be shown
    const isInMaintenanceMode = await get<boolean>('isInMaintenanceMode')

    // If is in maintenance mode, point the url pathname to the maintenance page
    if (isInMaintenanceMode) {
      req.nextUrl.pathname = `/maintenance`

      // Rewrite to the url
      return NextResponse.rewrite(req.nextUrl)
    }
  } catch (error) {
    // show the default page if EDGE_CONFIG env var is missing,
    // but log the error to the console
    console.error(error)
  }
}
