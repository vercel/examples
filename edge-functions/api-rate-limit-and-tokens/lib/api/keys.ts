import { jwtVerify } from 'jose'
import { initRateLimit } from '@lib/rate-limit'
import { upstashRest } from '@lib/upstash'
import { API_KEYS, API_KEYS_JWT_SECRET_KEY } from './constants'
import { ipRateLimit } from '@lib/ip-rate-limit'

export type ApiTokenPayload = {
  jti: string
  iat: number
  limit: number
  timeframe: number
}

const tokenExpired = () =>
  new Response(
    JSON.stringify({ error: { message: 'Your token has expired' } }),
    {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

/**
 * Creates a rate limit function that uses the API token to for rate
 * limiting, and fallbacks to IP rate limiting if there's no token
 */
export const tokenRateLimit = initRateLimit(async (request) => {
  // Get bearer token from header
  const token = request.headers.get('Authorization')?.split(' ')[1]

  // Fallback to IP rate limiting if no bearer token is present
  if (!token) return ipRateLimit(request)

  let payload: ApiTokenPayload
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(API_KEYS_JWT_SECRET_KEY)
    )
    payload = verified.payload as ApiTokenPayload
  } catch (err) {
    return tokenExpired()
  }

  return {
    ...payload,
    id: `api-token:${payload.jti}`,
    count: async ({ key, timeframe }) => {
      const results = await upstashRest(
        [
          ['HGET', API_KEYS, payload.jti],
          ['INCR', key],
          ['EXPIRE', key, timeframe],
        ],
        { pipeline: true }
      )
      const jwt = results[0].result
      const count = results[1].result

      // The token no longer exists in Redis
      if (!jwt) return tokenExpired()

      return count
    },
  }
})
