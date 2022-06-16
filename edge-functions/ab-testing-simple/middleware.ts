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
  // Get the bucket from the cookie
  let bucket = req.cookies.get(data.cookie)
  let hasBucket = !!bucket

  // If there's no active bucket in cookies or its value is invalid, get a new one
  if (!bucket || !data.buckets.includes(bucket as any)) {
    bucket = getBucket(data.buckets)
    hasBucket = false
  }

  // Create a rewrite to the page matching the bucket
  const url = req.nextUrl.clone()
  url.pathname = `${data.page}/${bucket}`
  const res = NextResponse.rewrite(url)

  // Add the bucket to the response cookies if it's not there
  // or if its value was invalid
  if (!hasBucket) {
    res.cookies.set(data.cookie, bucket)
  }

  return res
}
