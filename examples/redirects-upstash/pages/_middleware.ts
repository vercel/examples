import type { EdgeRequest, EdgeResponse } from 'next'
import redirects from '@lib/redirects'

export async function middleware(
  req: EdgeRequest,
  res: EdgeResponse,
  next: any
) {
  if (await redirects(req, res)) return
  next()
}
