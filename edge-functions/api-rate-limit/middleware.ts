import { NextRequest, NextResponse } from 'next/server'
import { ipRateLimit } from '@lib/ip-rate-limit'

export const config = {
  matcher: '/api/ping',
}

export async function middleware(req: NextRequest) {
  // Send the request to the IP rate limiter.
  // this will add headers containing information about the rate limit.
  const rateLimitResponse = await ipRateLimit(req)
  const res = NextResponse.next()

  // Add the rate limit headers to the response.
  for (const [key, value] of rateLimitResponse.headers.entries()) {
    res.headers.set(key, value)
  }

  return res
}
