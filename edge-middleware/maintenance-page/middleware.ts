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
      // Optional
      // Exclude core Next.js files, static files, and files in the public folder
      // that might affect rendering the maintenance page
      const pathname = req.nextUrl.pathname
      const PUBLIC_FILE = /\.(.*)$/
      
      if (
        pathname.startsWith("/_next") || // exclude Next.js internals
        pathname.startsWith("/static") || // exclude static files
        PUBLIC_FILE.test(pathname)  // exclude all files in the public folder
      ) {
        return NextResponse.next()
      }
      
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
