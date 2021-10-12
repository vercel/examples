import type { EdgeRequest, EdgeResponse } from 'next'
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
  req: EdgeRequest,
  res: EdgeResponse,
  ctx: T & RateLimitCtx
) => void | Promise<void>

export type CountFunction<T extends {} = {}> = (
  context: T &
    RateLimitCtx & { req: EdgeRequest; res: EdgeResponse; key: string }
) => Promise<number | void>

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

const rateLimited: RateLimitHandler = (_, res, { id }) => {
  res.status(403)
  res.json({
    message: `API rate limit exceeded for ${id}`,
  })
}

export async function rateLimit<T extends RateLimitCtx>(
  req: EdgeRequest,
  res: EdgeResponse,
  context: T,
  countFunction: CountFunction<T>,
  headers?: RateLimitHeaders,
  handler: RateLimitHandler<T> = rateLimited
) {
  headers = getHeaders(headers)

  const { id, limit, timeframe } = context
  // Temporal logging
  const start = Date.now()
  // By removing the milliseconds our of the date and dividing by `timeframe`
  // we now have a time that changes every `timeframe` seconds
  const time = Math.floor(Date.now() / 1000 / timeframe)
  const key = `${id}:${time}`
  const count = await countFunction({ ...context, req, res, key }).catch(
    // If the count function fails we'll ignore rate limiting
    (err) => {
      console.error('Rate limit `countFunction` failed with:', err)
      return null
    }
  )

  if (!Number.isInteger(count) || res.finished) {
    return res.finished
  }

  const remaining = limit - (count as number)
  const reset = (time + 1) * timeframe

  // Temporal logging
  const latency = Date.now() - start

  res.headers.set('x-upstash-latency', `${latency}`)
  res.headers.set('Content-Type', 'application/json')

  if (headers[0]) res.headers.set(headers[0], `${limit}`)
  if (headers[1])
    res.headers.set(headers[1], `${remaining < 0 ? 0 : remaining}`)
  if (headers[2]) res.headers.set(headers[2], `${reset}`)
  if (remaining < 0) {
    await handler(req, res, context)
    return true
  }
  return false
}

export const createRateLimit = (options: RateLimitOptions) =>
  function isRateLimited(
    req: EdgeRequest,
    res: EdgeResponse,
    limit = options.limit,
    timeframe = options.timeframe,
    headers = options.headers,
    handler = options.handler
  ) {
    return rateLimit(
      req,
      res,
      { id: `ip:${getIP(req)}`, limit, timeframe },
      options.countFunction,
      headers,
      handler
    )
  }
