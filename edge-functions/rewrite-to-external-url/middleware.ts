import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const hostname = req.headers.get('host')

  if (hostname === 'support-site.vercel.pub' || hostname === 'localhost:3000') {
    // rewrites "support-site.vercel.pub" to "https://www.zendesk.com"
    // note that it's important to check if the URL that you are rewriting to
    // has trailing slashes or not – or else you'll end up with a redirect loop.
    // also, note that the URL that you are rewriting to must be a full URL,
    // and has to include the `www` subdomain if it's present.
    return NextResponse.rewrite(`https://www.zendesk.com/${pathname}/`)
  }
}
