import type { NextRequest } from 'next/server'
import getIP from './get-ip'

export interface RateLimitCtx {
  id: string
  limit: number
  timeframe: number
}

export type RateLimitHeaders =
  | null
  | string
  | readonly [string | null, string | null, string | null]

export type RateLimitHandler<T extends {} = {}> = (
  request: NextRequest,
  ctx: T & RateLimitCtx
) => Response | Promise<Response>

export type CountFunction<T extends {} = {}> = (
  context: T & RateLimitCtx & { request: NextRequest; key: string }
) => Promise<number | Response>

export interface RateLimitOptions<T extends {} = {}> {
  limit: number
  timeframe: number
  countFunction: CountFunction<T>
  headers?: RateLimitHeaders
  handler?: RateLimitHandler<T>
}

function getHeaders(nameOrHeaders?: RateLimitHeaders) {
  nameOrHeaders = nameOrHeaders ?? 'RateLimit'
  return !nameOrHeaders || typeof nameOrHeaders === 'string'
    ? ([
        `X-${nameOrHeaders}-Limit`,
        `X-${nameOrHeaders}-Remaining`,
        `X-${nameOrHeaders}-Reset`,
      ] as const)
    : nameOrHeaders
}

const rateLimited: RateLimitHandler = (_, { id }) => {
  return new Response(
    JSON.stringify({
      error: { message: `API rate limit exceeded for ${id}` },
    }),
    {
      status: 403,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}

export async function rateLimit<T extends RateLimitCtx>(
  request: NextRequest,
  context: T,
  countFunction: CountFunction<T>,
  headers?: RateLimitHeaders,
  handler: RateLimitHandler<T> = rateLimited
): Promise<false | Response> {
  headers = getHeaders(headers)

  const { id, limit, timeframe } = context
  // Temporal logging
  const start = Date.now()
  // By removing the milliseconds our of the date and dividing by `timeframe`
  // we now have a time that changes every `timeframe` seconds
  const time = Math.floor(Date.now() / 1000 / timeframe)
  const key = `${id}:${time}`
  const count = await countFunction({ ...context, request, key }).catch(
    // If the count function fails we'll ignore rate limiting
    (err) => {
      console.error('Rate limit `countFunction` failed with:', err)
      return null
    }
  )

  if (count instanceof Response) {
    return count
  }
  if (count === null) return false

  const remaining = limit - (count as number)
  const reset = (time + 1) * timeframe

  // Temporal logging
  const latency = Date.now() - start

  request.headers.set('x-upstash-latency', `${latency}`)
  request.headers.set('Content-Type', 'application/json')

  if (headers[0]) request.headers.set(headers[0], `${limit}`)
  if (headers[1])
    request.headers.set(headers[1], `${remaining < 0 ? 0 : remaining}`)
  if (headers[2]) request.headers.set(headers[2], `${reset}`)
  if (remaining < 0) {
    return handler(request, context)
  }
  return false
}

export const createRateLimit = (options: RateLimitOptions) =>
  function isRateLimited(
    request: NextRequest,
    limit = options.limit,
    timeframe = options.timeframe,
    headers = options.headers,
    handler = options.handler
  ) {
    console.log('MY IP', getIP(request))
    return rateLimit(
      request,
      { id: `ip:${getIP(request)}`, limit, timeframe },
      options.countFunction,
      headers,
      handler
    )
  }
