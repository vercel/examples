import type { EdgeRequest, EdgeResponse, EdgeNext } from 'next'
import get from 'lib/redis'

export default async function (
  req: EdgeRequest,
  res: EdgeResponse,
  next: EdgeNext
) {
  if (await get('store-closed')) {
    res.rewrite(`/_closed`)
  }
  next()
}
