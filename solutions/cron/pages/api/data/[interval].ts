import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  const interval = req.nextUrl.searchParams.get('interval')
  if (!interval) return new Response('No interval provided', { status: 400 })
  const { id, fetchedAt } =
    (await kv.get<{
      id: string
      fetchedAt: string
    } | null>(interval)) || {}
  const res = await fetch(
    `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`
  ).then((res) => res.json())
  return new NextResponse(
    JSON.stringify({
      fetchedAt,
      ...res,
    }),
    {
      status: 200,
    }
  )
}
