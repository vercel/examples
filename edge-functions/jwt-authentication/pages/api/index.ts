import type { NextApiRequest, NextApiResponse } from 'next'
import { jwtVerify } from 'jose'
import { nanoid } from 'nanoid'
import { USER_TOKEN, JWT_SECRET_KEY } from '@lib/constants'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: { message: 'Method not allowed' },
    })
  }
  try {
    const token = req.cookies[USER_TOKEN]
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET_KEY)
    )
    res.status(200).json({ nanoid: nanoid(), jwtID: payload.jti })
  } catch (err) {
    res.status(401).json({ error: { message: 'Your token has expired.' } })
  }
}
