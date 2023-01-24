import { NextRequest, NextResponse } from 'next/server'
import { getBucket } from '@lib/ab-testing'
import { HOME_BUCKETS, MARKETING_BUCKETS } from '@lib/buckets'

type Route = {
  page: string
  cookie: string
  buckets: readonly string[]
}

const ROUTES: Record<string, Route | undefined> = {
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

export const config = {
  matcher: ['/home', '/marketing'],
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const route = ROUTES[pathname]

  if (!route) return

  // Get the bucket from the cookie
  let bucket = req.cookies.get(route.cookie)?.value
  let hasBucket = !!bucket

  // If there's no active bucket in cookies or its value is invalid, get a new one
  if (!bucket || !route.buckets.includes(bucket as any)) {
    bucket = getBucket(route.buckets)
    hasBucket = false
  }

  // Create a rewrite to the page matching the bucket
  const url = req.nextUrl.clone()
  url.pathname = `${route.page}/${bucket}`
  const res = NextResponse.rewrite(url)

  // Add the bucket to the response cookies if it's not there
  // or if its value was invalid
  if (!hasBucket) {
    res.cookies.set(route.cookie, bucket)
  }

  return res
}
