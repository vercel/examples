import { NextRequest, NextResponse } from 'next/server'
import { getHostnameDataOrDefault } from './lib/db'

export const config = {
  matcher: ['/', '/about', '/_sites/:path'],
}

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl

  // Get hostname (e.g. vercel.com, test.vercel.app, etc.)
  const hostname = req.headers.get('host')

  // If localhost, assign the host value manually
  // If prod, get the custom domain/subdomain value by removing the root URL
  // (in the case of "test.vercel.app", "vercel.app" is the root URL)
  const currentHost =
    process.env.NODE_ENV === 'production' &&
    hostname.replace(`.${process.env.ROOT_DOMAIN}`, '')
  const data = await getHostnameDataOrDefault(currentHost)

  // Prevent security issues – users should not be able to canonically access
  // the pages/sites folder and its respective contents.
  if (url.pathname.startsWith(`/_sites`)) {
    url.pathname = `/404`
  } else {
    console.log('URL 2', req.nextUrl.href)
    // rewrite to the current subdomain under the pages/sites folder
    url.pathname = `/_sites/${data.subdomain}${url.pathname}`
  }

  return NextResponse.rewrite(url)
}
