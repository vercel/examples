import { parseConnectionString } from '@vercel/edge-config'
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

  if (!process.env.EDGE_CONFIG) {
    throw new Error('Missing EDGE_CONFIG environment variable')
  }

  const parsedConnectionString = parseConnectionString(process.env.EDGE_CONFIG)

  if (!parsedConnectionString) {
    throw new Error(
      'Could not parse EDGE_CONFIG environment variable. Looks like it is not a valid connection string.'
    )
  }

  const edgeConfigId = parsedConnectionString.id
  const response = await fetch(
    `https://api.vercel.com/v1/edge-config/${edgeConfigId}/items${
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
