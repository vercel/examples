import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''

  // Debug logging
  console.log('Middleware called for:', hostname)

  // Extract sandbox ID from subdomain
  const match = hostname.match(/^([^.]+)\.sjksldjflksjkfjdslj\.xyz$/)

  if (match && match[1] !== 'vibe') {
    const sandboxId = match[1]
    console.log('Redirecting sandbox:', sandboxId)
    // Redirect to actual Vercel sandbox URL
    return NextResponse.redirect(
      `https://${sandboxId}.vercel.app${request.nextUrl.pathname}${request.nextUrl.search}`
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
}
