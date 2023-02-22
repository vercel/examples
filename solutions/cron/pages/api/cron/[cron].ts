import { NextRequest, NextResponse } from 'next/server'

export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  const cron = req.nextUrl.searchParams.get('cron')
  if (!cron) return new Response('No cron provided', { status: 400 })
  const response = await update(cron)
  return new NextResponse(JSON.stringify(response), {
    status: 200,
  })
}

async function update(interval: string) {
  const topstories = await fetch(
    'https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty'
  ).then((res) => res.json())

  const response = await fetch(
    `https://api.vercel.com/v1/edge-config/${process.env.EDGE_CONFIG_ID}/items${
      process.env.TEAM_ID_VERCEL ? `?teamId=${process.env.TEAM_ID_VERCEL}` : ''
    }`,
    {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN_VERCEL}`,
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
      body: JSON.stringify({
        items: [
          {
            operation: 'upsert',
            key: interval,
            value: {
              fetchedAt: Date.now(),
              id: topstories[0],
            },
          },
        ],
      }),
    }
  ).then((res) => res.json())

  return response
}
