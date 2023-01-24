import { NextRequest, NextResponse } from 'next/server'
import { getPersonalizedRewrite } from '@builder.io/personalization-utils'

const excludededPrefixes = ['/favicon', '/api']

export default function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()

  if (!excludededPrefixes.find((path) => url.pathname?.startsWith(path))) {
    const rewrite = getPersonalizedRewrite(url.pathname!, req.cookies)
    if (rewrite) {
      url.pathname = rewrite
      return NextResponse.rewrite(url)
    }
  }
}
