import type { NextRequest } from 'next/server'
import { tokenRateLimit } from '@lib/api/keys'

export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  const res = await tokenRateLimit(req)
  // If the status is not 200 then it has been rate limited.
  if (res.status !== 200) return res

  res.headers.set('content-type', 'application/json')

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: res.headers,
  })
}
