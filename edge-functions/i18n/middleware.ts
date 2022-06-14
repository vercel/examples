// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from 'next/server'

// export const config = {
//   matcher: '/',
// }

export function middleware(req: NextRequest) {
  console.log('running')
  const country = req.geo.country?.toLowerCase() || 'us'
  const locale = req.headers.get('accept-language')?.split(',')?.[0] || 'en-US'

  // Only rewrite files that don't have a file extension
  req.nextUrl.pathname = `/${locale}/${country}`
  return NextResponse.rewrite(req.nextUrl)
}
