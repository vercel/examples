import type { NextRequest } from 'next/server'
import { tokenRateLimit } from '@lib/api/keys'

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === '/api') {
    const res = await tokenRateLimit(req)
    if (res.status !== 200) return res

    res.headers.set('content-type', 'application/json')

    return new Response(JSON.stringify({ done: true }), {
      status: 200,
      headers: res.headers,
    })
  }
}
