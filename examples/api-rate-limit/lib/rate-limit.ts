import type { EdgeRequest, EdgeResponse } from 'next'

export type RateLimitHeaders =
  | null
  | string
  | readonly [string | null, string | null, string | null]

export type RateLimitHandler = (
  req: EdgeRequest,
  res: EdgeResponse,
  ctx: { ip: string }
) => void | Promise<void>

export type CountFunction = (key: string, timeframe: number) => Promise<number>

export type RateLimitOptions = {
  countFunction: CountFunction
  limit: number
  timeframe: number
  headers?: RateLimitHeaders
  handler?: RateLimitHandler
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

const rateLimited: RateLimitHandler = (_, res, { ip }) => {
  res.status(403)
  res.json({
    message: `API rate limit exceeded for ${ip}`,
  })
}

async function rateLimit(
  countFunction: CountFunction,
  req: EdgeRequest,
  res: EdgeResponse,
  limit: number,
  timeframe: number,
  headers?: RateLimitHeaders,
  handler: RateLimitHandler = rateLimited
) {
  headers = getHeaders(headers)

  // Temporal logging
  const start = Date.now()

  const ip = req.headers.get('x-forwarded-for')
    ? req.headers.get('x-forwarded-for')!.split(',')[0]
    : '127.0.0.1'
  // By removing the milliseconds our of the date and dividing by `timeframe`
  // we now have a time that changes every `timeframe` seconds
  const time = Math.floor(Date.now() / 1000 / timeframe)
  const key = `${ip}:${time}`
  const count = await countFunction(key, timeframe)
  const remaining = limit - count
  const reset = (time + 1) * timeframe

  // Temporal logging
  const latency = Date.now() - start
  console.log('Upstash took', latency)
  res.headers.set('x-upstash-latency', `${latency}`)

  if (headers[0]) res.headers.set(headers[0], `${limit}`)
  if (headers[1])
    res.headers.set(headers[1], `${remaining < 0 ? 0 : remaining}`)
  if (headers[2]) res.headers.set(headers[2], `${reset}`)
  if (remaining < 0) {
    await handler(req, res, { ip })
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
      options.countFunction,
      req,
      res,
      limit,
      timeframe,
      headers,
      handler
    )
  }
