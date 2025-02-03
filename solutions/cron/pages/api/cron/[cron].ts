import { NextApiRequest, NextApiResponse } from 'next'
import { kv } from '@vercel/kv'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cron = req.url?.split('/')[3]
  console.log(cron)
  if (!cron) return res.status(400).json({ error: 'No cron provided' })
  const response = await update(cron)
  return res.status(200).json(response)
}

async function update(interval: string) {
  const topstories = await fetch(
    'https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty'
  ).then((res) => res.json())

  const response = await kv.set(interval, {
    fetchedAt: Date.now(),
    id: topstories[0]
  })

  return response
}
