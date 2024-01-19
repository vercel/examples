import { NextRequest } from 'next/server'
import { redirectMiddleware } from './redirects/redirect-middleware'

export async function middleware(request: NextRequest) {
  const redirect = await redirectMiddleware(request)
  if (redirect) {
    return redirect
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
