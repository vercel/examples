// eslint-disable-next-line @next/next/no-server-import-in-page
import { type NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@lib/auth'
import { USER_TOKEN } from '@lib/constants'

export const config = {
  matcher: '/protected',
}

export async function middleware(req: NextRequest, res: NextResponse) {
  const url = new URL(req.url)
  const token = req.cookies.get(USER_TOKEN)

  // validate the user is authenticated
  const verifiedToken = await verifyAuth(req)

  // redirect if the token is invalid
  if (!verifiedToken) {
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // let the request go forward if the token is valid
  return res
}
