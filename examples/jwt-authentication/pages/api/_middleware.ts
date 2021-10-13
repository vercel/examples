import type { EdgeRequest, EdgeResponse } from 'next'
import { nanoid } from 'nanoid'
import { verifyAuth } from '@lib/auth'

export async function middleware(
  req: EdgeRequest,
  res: EdgeResponse,
  next: any
) {
  if (req.url?.query.edge === '') {
    const payload = await verifyAuth(req, res)
    if (!payload) return

    res.status(200).json({ nanoid: nanoid(), jwtID: payload.jti })
  }

  next()
}
