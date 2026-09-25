import { NextResponse, type NextRequest } from 'next/server'

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'localhost:3000'

// Returns the tenant subdomain for a host, or null for the root app.
function getSubdomain(host: string): string | null {
  // Ignore the port when matching (e.g. "acme.localhost:3000").
  const hostname = host.split(':')[0]
  const rootHostname = ROOT_DOMAIN.split(':')[0]

  // Vercel preview URLs are not tenants.
  if (hostname.endsWith('.vercel.app')) return null

  // The root app is served on the bare domain and a couple of reserved names.
  if (
    hostname === rootHostname ||
    hostname === `www.${rootHostname}` ||
    hostname === `app.${rootHostname}`
  ) {
    return null
  }

  if (hostname.endsWith(`.${rootHostname}`)) {
    return hostname.slice(0, -(rootHostname.length + 1))
  }

  return null
}

export function proxy(request: NextRequest) {
  const host = request.headers.get('host') ?? ''
  const subdomain = getSubdomain(host)

  // Root app (dashboard, auth, landing) is served as-is.
  if (!subdomain) return NextResponse.next()

  // Tenant subdomains render the public blog under /s/[subdomain].
  const url = request.nextUrl.clone()
  url.pathname = `/s/${subdomain}${url.pathname === '/' ? '' : url.pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  // Skip Next internals, the API, and static files.
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
