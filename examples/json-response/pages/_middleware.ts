import type { EdgeRequest, EdgeResponse, EdgeNext } from 'next'

export default async function (
  req: EdgeRequest,
  res: EdgeResponse,
  next: EdgeNext
) {
  return res.json({ message: 'hello world!' })
}
