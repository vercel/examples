import type { NextRequest } from 'next/server'
import { ipRateLimit } from '@lib/ip-rate-limit'

export const config = {
  runtime: 'experimental-edge',
}

export default async function handler(req: NextRequest) {
  const res = await ipRateLimit(req)
  // If the status is not 200 then it has been rate limited.
  if (res.status !== 200) return res

  res.headers.set('content-type', 'application/json')

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: res.headers,
  })
}
