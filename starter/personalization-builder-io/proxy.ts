import { getPersonalizedRewrite } from '@builder.io/personalization-utils'
import { type NextRequest, NextResponse } from 'next/server'

const excludededPrefixes = ['/favicon', '/api']

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone()

  if (!excludededPrefixes.find((path) => url.pathname.startsWith(path))) {
    const cookies = Object.fromEntries(
      request.cookies.getAll().map(({ name, value }) => [name, value])
    )
    const rewrite = getPersonalizedRewrite(url.pathname, cookies)
    if (rewrite) {
      url.pathname = rewrite
      return NextResponse.rewrite(url)
    }
  }
}
