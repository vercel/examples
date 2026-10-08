import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE, isValidSessionToken } from '@/lib/auth/token'
import { isDemoMode } from '@/lib/demo'

/** Paths that authenticate themselves (shared secret) or must stay public. */
const PUBLIC_PREFIXES = ['/login', '/api/cron/', '/api/internal/']

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl

  if (
    PUBLIC_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(prefix)
    )
  ) {
    return NextResponse.next()
  }

  // A demo deployment is readable by everyone; server actions refuse writes themselves.
  if (isDemoMode()) {
    return NextResponse.next()
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value
  if (await isValidSessionToken(token, process.env.ADMIN_PASSWORD ?? '')) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const loginUrl = new URL('/login', request.url)
  if (pathname !== '/') loginUrl.searchParams.set('next', pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|robots.txt|.*\\.(?:png|svg|ico|jpg|webp)$).*)',
  ],
}
