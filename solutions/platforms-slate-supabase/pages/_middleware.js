import { NextResponse } from 'next/server'

export default function middleware(req) {
  const url = req.nextUrl.clone()
  const hostname = req.headers.get('host') // get hostname of request

  // only for demo purposes – remove this if you want to use your root domain as the landing page
  if (hostname === 'vercel.im' || hostname === 'platforms.vercel.app') {
    return NextResponse.redirect('https://demo.vercel.im')
  }

  const currentHost =
    process.env.NODE_ENV === 'production' && process.env.VERCEL === '1'
      ? hostname.replace(`.vercel.im`, '')
      : hostname.replace(`.localhost:3000`, '')

  if (url.pathname.startsWith(`/_sites`)) {
    return new Response(null, { status: 404 })
  }
  if (url.pathname.includes('.') || url.pathname.startsWith('/api')) return
  if (
    currentHost == 'app' &&
    url.pathname === '/login' &&
    (req.cookies['next-auth.session-token'] ||
      req.cookies['__Secure-next-auth.session-token'])
  ) {
    return NextResponse.redirect('/')
  }
  if (currentHost == 'app') {
    url.pathname = `/app${pathname}`
  } else if (hostname === 'localhost:3000') {
    url.pathname = `/home`
  } else {
    url.pathname = `/_sites/${currentHost}${pathname}`
  }

  return NextResponse.rewrite(url)
}
