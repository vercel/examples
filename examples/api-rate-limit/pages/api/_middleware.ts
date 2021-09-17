import type { EdgeRequest, EdgeResponse } from 'next'
import { createRateLimit } from '@lib/rate-limit'
import increment from '@lib/increment'

const rateLimit = createRateLimit({
  countFunction: increment,
  limit: 5,
  timeframe: 10,
})

export async function middleware(
  req: EdgeRequest,
  res: EdgeResponse,
  next: any
) {
  if (await rateLimit(req, res)) return
  if (req.url?.pathname === '/api') {
    return res.json({ done: true })
  }
  next()
}
