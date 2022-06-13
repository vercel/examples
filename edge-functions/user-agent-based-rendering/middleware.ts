import { NextRequest, NextResponse, userAgent } from 'next/server'

// Set pathname were middleware will be executed
export const config = {
  matcher: '/',
}

export function middleware(req: NextRequest) {
  // Parse user agent
  const { device } = userAgent(req)

  // Check the viewport
  const viewport = device.type === 'mobile' ? 'mobile' : 'desktop'

  // Update the expected url
  req.nextUrl.pathname = `_viewport/${viewport}`

  // Return rewrited response
  return NextResponse.rewrite(req.nextUrl)
}
