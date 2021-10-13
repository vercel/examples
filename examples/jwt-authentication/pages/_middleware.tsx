import type { EdgeRequest, EdgeResponse } from 'next'
import { setDemoToken } from '@lib/auth'

export async function middleware(
  req: EdgeRequest,
  res: EdgeResponse,
  next: any
) {
  // Sets the `user-token` JWT cookie
  await setDemoToken(req, res)
  next()
}
