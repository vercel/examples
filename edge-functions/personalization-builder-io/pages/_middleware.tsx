import { NextRequest, NextResponse } from 'next/server'
import { getPersonalizedRewrite } from '@builder.io/personalization-utils'

const excludededPrefixes = ['/favicon', '/api']

export default function middleware(request: NextRequest) {
  const url = request.nextUrl
  let response = NextResponse.next()
  if (!excludededPrefixes.find((path) => url.pathname?.startsWith(path))) {
    const rewrite = getPersonalizedRewrite(
      url?.pathname!,
      request.cookies
    )
    if (rewrite) {
      response = NextResponse.rewrite(rewrite)
    }
  }
  return response
}
