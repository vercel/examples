import type { NextFetchEvent } from 'next/server'
import { NextResponse } from 'next/server'
import { USER_TOKEN, JWT_SECRET_KEY } from './constants'
import { nanoid } from 'nanoid'
import jwt from '@tsndr/cloudflare-worker-jwt'

interface UserJwtPayload {
  jti: string
  iat: number
}

export async function handleAuth(event: NextFetchEvent) {
  const token = event.request.cookies[USER_TOKEN]
  if (!token) {
    return new NextResponse(
      JSON.stringify({ error: { message: 'Missing user token' } }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }

  if (!(await jwt.verify(token, JWT_SECRET_KEY))) {
    return new NextResponse(
      JSON.stringify({ error: { message: 'Your token has expired.' } }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }

  const payload = jwt.decode(token) as UserJwtPayload
  return new Response(
    JSON.stringify({ nanoid: nanoid(), jwtID: payload.jti }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}

export async function handleSetCookie(event: NextFetchEvent) {
  const response = NextResponse.next()
  const cookie = event.request.cookies[USER_TOKEN]
  if (!cookie) {
    const token = await jwt.sign(
      <UserJwtPayload>{
        jti: nanoid(),
        iat: Date.now() / 1000,
      },
      JWT_SECRET_KEY
    )

    response.cookie(USER_TOKEN, token)
  }

  return response
}
