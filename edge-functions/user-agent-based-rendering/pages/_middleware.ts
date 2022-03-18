import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

// RegExp for public files
const PUBLIC_FILE = /\.(.*)$/

export function middleware(req: NextRequest) {
  // Clone the URL
  const url = req.nextUrl.clone()

  // Prevent middleware to execute on public files
  if (PUBLIC_FILE.test(url.pathname)) {
    return req
  }

  // Prevent internals from being accessed canonically
  if (url.pathname.startsWith(`/_viewport`)) {
    return new Response(null, { status: 404 })
  }

  // Check the viewport
  const viewport = ['android', 'ios'].includes(req.ua?.os.name?.toLowerCase()!)
    ? 'mobile'
    : 'desktop'

  // Update the expected url
  url.pathname = `_viewport/${viewport}${url.pathname}`

  // Return rewrited response
  return NextResponse.rewrite(url)
}
