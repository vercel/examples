import type { EdgeRequest, EdgeResponse } from 'next'
import { setBucket } from '@lib/ab-testing'
import { MARKETING_BUCKETS } from '@lib/buckets'

export default function middleware(req: EdgeRequest, res: EdgeResponse) {
  // Get and set the bucket cookie
  const bucket = setBucket(req, res, MARKETING_BUCKETS, 'bucket-marketing')

  // rewrite to the assigned bucket
  res.rewrite(`/marketing/${bucket}`)
}
