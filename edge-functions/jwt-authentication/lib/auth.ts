// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest } from 'next/server'
import { nanoid } from 'nanoid'
import { SignJWT, jwtVerify } from 'jose'
import { USER_TOKEN, JWT_SECRET_KEY } from './constants'
import type { NextApiRequest, NextApiResponse } from 'next'

interface UserJwtPayload {
  jti: string
  iat: number
}

export class AuthError extends Error {}

/**
 * Verifies the user's JWT token and returns its payload if it's valid.
 */
export async function verifyAuth(request: NextRequest) {
  const token = request.cookies.get(USER_TOKEN)

  if (!token) throw new AuthError('Missing auth token')

  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET_KEY)
    )
    return verified.payload as UserJwtPayload
  } catch (err) {
    throw new AuthError('Your token has expired.')
  }
}

/**
 * Adds the user token cookie to a response from api routes.
 */
export async function setUserCookie(response: NextApiResponse) {
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(new TextEncoder().encode(JWT_SECRET_KEY))

  response.setHeader('Set-Cookie', [
    `${USER_TOKEN}=${token}; Path=/ ; Secure ; HttpOnly ; SameSite=Strict ; Max-Age=${
      // 2 hours in ms
      2 * 60 * 60 * 1000
    } ;`,
  ])

  return response
}

/**
 * Expires the jwt cookie
 */
export async function expireUserCookie(response: NextApiResponse) {
  response.setHeader('Set-Cookie', [
    `${USER_TOKEN}=deleted; Path=/ ; Secure ; HttpOnly ; SameSite=Strict ; expires=Thu, 01 Jan 1970 00:00:00 GMT ;`,
  ])

  return response
}
