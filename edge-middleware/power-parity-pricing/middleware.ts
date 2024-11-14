import { geolocation } from '@vercel/functions'
import { type NextRequest, NextResponse } from 'next/server'

// Set pathname were middleware will be executed
export const config = {
  matcher: '/',
}

export default function middleware(req: NextRequest) {
  // Get country
  const country = geolocation(req).country?.toLowerCase() || 'us'

  // Update pathname
  req.nextUrl.pathname = `/${country}`

  // Rewrite to URL
  return NextResponse.rewrite(req.nextUrl)
}
