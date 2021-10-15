/**
 * Multi purpose rate limiting API, consider this a library
 * that can work outside the demo.
 */
import type { NextRequest } from 'next/server'

export interface RateLimitContextBase {
  id: string
  limit: number
  timeframe: number
  count: CountFn
}

export interface RateLimitContext extends RateLimitContextBase {
  request: NextRequest
  headers: readonly [string | null, string | null, string | null]
  onRateLimit: OnRateLimit
}

export type RateLimitHandler = (
  request: NextRequest
) => Promise<RateLimitResult> | RateLimitResult

export type RateLimitResult =
  | (RateLimitContextBase & {
      request?: NextRequest
      headers?: RateLimitHeaders
      onRateLimit?: OnRateLimit
    })
  | Response
  | void

export type RateLimitHeaders =
  | null
  | string
  | readonly [string | null, string | null, string | null]

export type OnRateLimit = (
  context: RateLimitContext
) => Response | Promise<Response>

export type CountFn = (
  context: RateLimitContext & { key: string }
) => Promise<number | Response>

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

const rateLimited: OnRateLimit = ({ id }) => {
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

async function rateLimit(context: RateLimitContext) {
  let { request, headers, id, limit, timeframe, count, onRateLimit } = context

  // Temporal logging
  const start = Date.now()
  // By removing the milliseconds our of the date and dividing by `timeframe`
  // we now have a time that changes every `timeframe` seconds
  const time = Math.floor(Date.now() / 1000 / timeframe)
  const key = `${id}:${time}`
  let countOrRes: number | Response

  try {
    countOrRes = await count({ ...context, key })
  } catch (err) {
    // If the count function fails we'll ignore rate limiting
    console.error('Rate limit `count` failed with:', err)
    return
  }

  const h =
    countOrRes instanceof Response ? countOrRes.headers : request.headers
  const remaining = countOrRes instanceof Response ? 0 : limit - countOrRes
  const reset = (time + 1) * timeframe

  // Temporal logging
  const latency = Date.now() - start
  h.set('x-upstash-latency', `${latency}`)

  if (headers[0]) h.set(headers[0], `${limit}`)
  if (headers[1]) h.set(headers[1], `${remaining < 0 ? 0 : remaining}`)
  if (headers[2]) h.set(headers[2], `${reset}`)
  if (countOrRes instanceof Response) return countOrRes
  if (remaining < 0) {
    const res = await onRateLimit(context)

    // Concat the rate limiting headers
    headers.concat('x-upstash-latency').forEach((key) => {
      if (key) res.headers.set(key, h.get(key)!)
    })

    return res
  }
}

export const initRateLimit = (fn: RateLimitHandler) =>
  async function isRateLimited(request: NextRequest) {
    const ctx = await fn(request)

    // If there's no context don't do anything, this can happen if a
    // rate limiter calls another rate limiter
    if (!ctx) return
    if (ctx instanceof Response) return ctx

    return rateLimit({
      ...ctx,
      request: ctx.request ?? request,
      headers: getHeaders(ctx.headers),
      onRateLimit: ctx.onRateLimit ?? rateLimited,
    })
  }
