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
  // Get the bucket from the cookie
  let bucketInCookie = req.cookies.get(data.cookie)
  let bucket = bucketInCookie

  // If there's no active bucket or its value is invalid, get a new one
  if (!bucketInCookie || !data.buckets.includes(bucketInCookie as any)) {
    bucket = getBucket(data.buckets)
    bucketInCookie = undefined
  }

  // Create a rewrite to the page matching the bucket
  url.pathname = `${data.page}/${bucket}`
  const res = NextResponse.rewrite(url)

  // Add the bucket to the response cookies if it's not there
  // or if its value was invalid
  if (!bucketInCookie) {
    res.cookies.set(data.cookie, bucket)
  }

  return res
}
