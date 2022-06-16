import { type NextRequest, NextResponse } from 'next/server'
import { ipRateLimit } from '@lib/ip-rate-limit'

// run only on API routes
export const config = {
  matcher: '/api',
}

export async function middleware(req: NextRequest) {
  const res = await ipRateLimit(req)
  if (res.status !== 200) return res

  return NextResponse.next()
}
