import { redis } from '@/lib/upstash'
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

  const response = await redis.set(interval, {
    fetchedAt: Date.now(),
    id: topstories[0],
  })

  return response
}
