import { NextResponse } from 'next/server'
import { abby } from '@lib/abby'

export const config = {
  matcher: ['/home', '/marketing'],
}

export default abby.withAbbyEdge((req) => {
  const { pathname } = req.nextUrl
  if (pathname === '/home') {
    const [bucket, setCookie] = abby.getABTestValue('Home', req)
    const url = req.nextUrl.clone()
    url.pathname = `/home/${bucket}`
    const res = NextResponse.rewrite(url)
    setCookie(res)
    return res
  }

  if (pathname === '/marketing') {
    const [bucket, setCookie] = abby.getABTestValue('Marketing', req)
    const url = req.nextUrl.clone()
    url.pathname = `/marketing/${bucket}`
    const res = NextResponse.rewrite(url)
    setCookie(res)
    return res
  }
})
