import type { NextRequest } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { kv } from '@vercel/kv'

const ratelimit = new Ratelimit({
  redis: kv,
  // 5 requests from the same IP in 10 seconds
  limiter: Ratelimit.slidingWindow(5, '10 s'),
})

export const config = {
  runtime: 'edge',
}

export default async function handler(request: NextRequest) {
  // You could alternatively limit based on user ID or similar
  const ip = request.ip ?? '127.0.0.1'
  const { limit, reset, remaining } = await ratelimit.limit(ip)

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': reset.toString(),
    },
  })
}
