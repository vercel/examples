import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  // Clone the URL
  const url = req.nextUrl.clone()

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
