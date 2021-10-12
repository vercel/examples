import type { EdgeRequest, EdgeResponse } from 'next'
import { createTokenRateLimit } from '@lib/api/keys'
import increment from '@lib/increment'

// Does rate limiting based on a bearer token, or by
// IP address if there's no token.
const rateLimit = createTokenRateLimit({
  countFunction: increment,
  limit: 5,
  timeframe: 10,
})

export async function middleware(
  req: EdgeRequest,
  res: EdgeResponse,
  next: any
) {
  if (req.url?.pathname === '/api') {
    if (await rateLimit(req, res)) return

    res.headers.set('Content-Type', 'application/json')
    return res.json({ done: true })
  }
  next()
}
