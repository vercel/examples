import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  // Get the amount of requests remaining.
  const remainingRequests = res.getHeader('X-RateLimit-Remaining')

  // Return `success` being a boolean indicating if we have reached the rate limit.
  return res.json({ success: Number(remainingRequests) > 0 })
}
