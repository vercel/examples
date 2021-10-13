import type { EdgeRequest, EdgeResponse } from 'next'
import { nanoid } from 'nanoid'
import jwt from '@tsndr/cloudflare-worker-jwt'
import { USER_TOKEN, JWT_SECRET_KEY } from './constants'

export type UserJwtPayload = {
  jti: string
  iat: number
}

export async function setDemoToken(req: EdgeRequest, res: EdgeResponse) {
  const cookie = req.cookies[USER_TOKEN]

  if (!cookie) {
    const payload: UserJwtPayload = {
      jti: nanoid(),
      iat: Date.now() / 1000,
    }
    const token = await jwt.sign(payload, JWT_SECRET_KEY)

    res.cookie(USER_TOKEN, token)
  }
}

export async function verifyAuth(req: EdgeRequest, res: EdgeResponse) {
  const token = req.cookies[USER_TOKEN]

  if (!token) {
    return res.status(401).json({ error: { message: 'Missing user token' } })
  }
  if (!(await jwt.verify(token, JWT_SECRET_KEY))) {
    return res
      .status(401)
      .json({ error: { message: 'Your token has expired.' } })
  }

  // Return the JWT payload
  return jwt.decode(token) as UserJwtPayload
}
