import { redis, send, getTopStories } from '@/lib/utils'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email } = req.query
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Invalid email' })
  }

  const topStories = await getTopStories()

  const response = await Promise.all([
    redis.zadd('subscribers', {
      score: Date.now(),
      member: email,
    }),
    send(email, 'Hello World'),
  ])

  res.status(200).json(response)
}
