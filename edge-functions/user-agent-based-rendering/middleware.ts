import { NextRequest, NextResponse } from 'next/server'
import parser from 'ua-parser-js'

// RegExp for public files
const PUBLIC_FILE = /\.(.*)$/

// RegExp for public files
const NEXT_FILES = /^\/_next(.*?)/

// Set pathname were middleware will be executed
export const config = {
  pathname: '/',
}

export function middleware(req: NextRequest) {
  // Clone the URL
  const url = req.nextUrl.clone()

  // Skip public files
  if (PUBLIC_FILE.test(url.pathname) || NEXT_FILES.test(url.pathname)) return

  // Parse user agent
  const ua = parser(req.headers.get('user-agent')!)

  // Check the viewport
  const viewport = ua.device.type === 'mobile' ? 'mobile' : 'desktop'

  // Update the expected url
  url.pathname = `_viewport/${viewport}`

  // Return rewrited response
  return NextResponse.rewrite(url)
}
