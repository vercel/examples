import { NextFetchEvent, NextResponse } from 'next/server'
import { getBucket } from '@lib/ab-testing'
import { MARKETING_BUCKETS } from '@lib/buckets'

const COOKIE_NAME = 'bucket-marketing'

export function middleware(ev: NextFetchEvent) {
  // Get the bucket cookie
  const bucket = ev.request.cookies[COOKIE_NAME] || getBucket(MARKETING_BUCKETS)
  const res = NextResponse.rewrite(`/marketing/${bucket}`)

  // Add the bucket to cookies if it's not there
  if (!ev.request.cookies[COOKIE_NAME]) {
    res.cookie(COOKIE_NAME, bucket)
  }

  return ev.respondWith(res)
}
