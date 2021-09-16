import type { EdgeRequest, EdgeResponse, EdgeNext } from 'next'
import pick from 'object.pick'

export default async function (
  req: EdgeRequest,
  res: EdgeResponse,
  next: EdgeNext
) {
  res.rewrite({
    ...req.url,
    query: pick(req.url.query, ['allowed']),
  })
}
