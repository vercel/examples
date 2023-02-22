import { redis, getTopStories } from '@/lib/utils'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const emails = await redis.zrange('subscribers', 0, -1)
  const topStories = await getTopStories()
  res.status(200).json(topStories)
}
