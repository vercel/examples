import type { NextRequest } from 'next/server'
import jwt from '@tsndr/cloudflare-worker-jwt'
import {
  createRateLimit,
  rateLimit,
  RateLimitOptions,
  CountFunction,
} from '@lib/rate-limit'
import { upstashRest } from '@lib/upstash'
import { API_KEYS, API_KEYS_JWT_SECRET_KEY } from './constants'

export type ApiTokenPayload = {
  jti: string
  iat: number
  limit: number
  timeframe: number
}

export const createTokenRateLimit = (options: RateLimitOptions) => {
  const ipRateLimit = createRateLimit(options)

  return async function isRateLimited(
    request: NextRequest,
    headers = options.headers,
    handler = options.handler
  ) {
    // Get bearer token from header
    const token = request.headers.get('Authorization')?.split(' ')[1]

    if (token) {
      const isValid = await jwt.verify(token, API_KEYS_JWT_SECRET_KEY)
      if (!isValid) {
        return new Response(
          JSON.stringify({ error: { message: 'Your token has expired' } }),
          {
            status: 401,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
      }

      const payload = jwt.decode(token) as ApiTokenPayload

      return rateLimit(
        request,
        { id: `api-token:${payload.jti}`, ...payload },
        increment,
        headers,
        handler
      )
    }

    // Fallback to IP rate limiting if no bearer token is present
    return ipRateLimit(request)
  }
}

const increment: CountFunction<ApiTokenPayload> = async ({
  jti,
  key,
  timeframe,
}) => {
  const results = await upstashRest(
    [
      ['HGET', API_KEYS, jti],
      ['INCR', key],
      ['EXPIRE', key, timeframe],
    ],
    { pipeline: true }
  )
  const jwt = results[0].result
  const count = results[1].result

  if (!jwt) {
    // The token no longer exists in Redis
    return new Response(
      JSON.stringify({ error: { message: 'Your token has expired' } }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }

  return count
}
