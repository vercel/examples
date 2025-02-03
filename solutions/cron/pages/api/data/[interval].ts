import { NextApiRequest, NextApiResponse } from 'next'
import { kv } from '@vercel/kv'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const interval = req.query.interval as string
  if (!interval) return res.status(400).json({ error: 'No interval provided' })
  const { id, fetchedAt } =
    (await kv.get<{
      id: string
      fetchedAt: string
    } | null>(interval)) || {}
  const response = await fetch(
    `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`,
  ).then((res) => res.json())
  return res.status(200).json({
    fetchedAt,
    ...response,
  })
}
