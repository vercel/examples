import { NextRequest, NextResponse } from 'next/server'
import parser from 'ua-parser-js'

// RegExp for public files
const PUBLIC_FILE = /\.(.*)$/

export function middleware(req: NextRequest) {
  // Clone the URL
  const url = req.nextUrl.clone()

  // Skip public files
  if (PUBLIC_FILE.test(url.pathname)) return

  // Prevent internals from being accessed canonically
  if (url.pathname.startsWith(`/_viewport`)) {
    url.pathname = '/404'
    return NextResponse.rewrite(url)
  }

  // Parse user agent
  const ua = parser(req.headers.get('user-agent')!)

  // Check the viewport
  const viewport = ua.device.type === 'mobile' ? 'mobile' : 'desktop'

  // Update the expected url
  url.pathname = `_viewport/${viewport}${url.pathname}`

  // Return rewrited response
  return NextResponse.rewrite(url)
}
