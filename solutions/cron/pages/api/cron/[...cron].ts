import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { cron } = req.query
  if (!cron || !cron[0]) {
    return res.status(400).end(`Bad Request`)
  }
  const interval = cron[0]
  const response = await update(interval)
  res.status(200).json(response)
}

async function update(interval: string) {
  const topstories = await fetch(
    'https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty'
  ).then((res) => res.json())

  const response = await fetch(
    `https://api.vercel.com/v1/edge-config/${process.env.EDGE_CONFIG_ID}/items?teamId=${process.env.TEAM_ID_VERCEL}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN_VERCEL}`,
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
      body: JSON.stringify({
        items: [
          {
            operation: 'upsert',
            key: interval,
            value: topstories[0],
          },
        ],
      }),
    }
  ).then((res) => res.json())

  return response
}
