import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import jwt from '@tsndr/cloudflare-worker-jwt'
import { USER_TOKEN, JWT_SECRET_KEY } from './constants'
import { jsonResponse } from './utils'

interface UserJwtPayload {
  jti: string
  iat: number
}

/**
 * Verifies the user's JWT token and returns the payload if
 * it's valid or a response if it's not.
 */
export async function verifyAuth(request: NextRequest) {
  const token = request.cookies[USER_TOKEN]

  if (!token) {
    return jsonResponse(401, { error: { message: 'Missing user token' } })
  }

  if (!(await jwt.verify(token, JWT_SECRET_KEY))) {
    return jsonResponse(401, { error: { message: 'Your token has expired.' } })
  }

  return jwt.decode(token) as UserJwtPayload
}

/**
 * Adds the user token cookie to a response.
 */
export async function setUserCookie(
  request: NextRequest,
  response: NextResponse
) {
  const cookie = request.cookies[USER_TOKEN]

  if (!cookie) {
    const token = await jwt.sign(
      {
        jti: nanoid(),
        iat: Date.now() / 1000,
      },
      JWT_SECRET_KEY
    )
    response.cookie(USER_TOKEN, token)
  }

  return response
}
