import { NextRequest, NextResponse } from 'next/server'
import { getBucket } from '@lib/ab-testing'
import { HOME_BUCKETS } from '@lib/buckets'

const COOKIE_NAME = 'bucket-home'

export function middleware(req: NextRequest) {
  // Get the bucket cookie
  const bucket = req.cookies[COOKIE_NAME] || getBucket(HOME_BUCKETS)
  const res = NextResponse.rewrite(`/home/${bucket}`)

  // Add the bucket to cookies if it's not there
  if (!req.cookies[COOKIE_NAME]) {
    res.cookie(COOKIE_NAME, bucket)
  }

  return res
}
