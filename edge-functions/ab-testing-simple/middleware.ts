/* eslint-disable @next/next/no-server-import-in-page */
import { NextRequest, NextResponse } from 'next/server'
import { getBucket } from '@lib/ab-testing'
import { HOME_BUCKETS, MARKETING_BUCKETS } from '@lib/buckets'

const BUCKETS = {
  '/home': {
    page: '/home',
    cookie: 'bucket-home',
    buckets: HOME_BUCKETS,
  },
  '/marketing': {
    page: '/marketing',
    cookie: 'bucket-marketing',
    buckets: MARKETING_BUCKETS,
  },
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const route = Object.entries(BUCKETS).find(([route]) => pathname === route)

  if (!route) return

  const data = route[1]
  const url = req.nextUrl.clone()
  // Get the bucket from the cookie or get a new one
  let bucket = req.cookies.get(data.cookie) || getBucket(data.buckets)

  // If the bucket is invalid, set it to the first bucket
  if (!data.buckets.includes(bucket as any)) {
    bucket = data.buckets[0]
  }

  // Create a rewrite to the page matching the bucket
  url.pathname = `${data.page}/${bucket}`
  const res = NextResponse.rewrite(url)

  // Add the bucket to the response cookies if it's not there
  if (!req.cookies.has(data.cookie)) {
    res.cookies.set(data.cookie, bucket)
  }

  return res
}
