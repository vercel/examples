import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decodeJwt } from '../lib/jwt'
import { utils } from 'ethers'

const PROTECTED_ROUTES = new Set(['/'])

export function middleware(req: NextRequest) {
  let response = NextResponse.next()
  const url = req.nextUrl.clone()

  if (!PROTECTED_ROUTES.has(req.nextUrl.pathname)) {
    return response
  }

  const publicKey = process.env.PUBLIC_KEY

  if (!publicKey) {
    console.error('PUBLIC_KEY environment variable is not set')
    return response
  }

  const cookie = req.cookies['allow-list']

  if (!cookie || cookie === 'deleted') {
    return response
  }

  const data = decodeJwt(cookie)

  const approvedBy = utils.verifyMessage(
    `${data.address}-approved`,
    data.tokenVerification
  )

  if (approvedBy !== publicKey) {
    return response
  }

  url.pathname = '/protected'

  return NextResponse.rewrite(url)
}
