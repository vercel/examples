import { NextRequest, NextResponse } from 'next/server'
import parser from 'ua-parser-js'

// Set pathname were middleware will be executed
export const config = {
  matcher: '/',
}

export function middleware(req: NextRequest) {
  // Clone the URL
  const url = req.nextUrl.clone()

  // Parse user agent
  const ua = parser(req.headers.get('user-agent')!)

  // Check the viewport
  const viewport = ua.device.type === 'mobile' ? 'mobile' : 'desktop'

  // Update the expected url
  url.pathname = `_viewport/${viewport}`

  // Return rewrited response
  return NextResponse.rewrite(url)
}
