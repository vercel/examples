import { initRateLimit, CountFn } from './rate-limit'
import getIP from './get-ip'
import { upstashRest } from './upstash'

export const ipRateLimit = initRateLimit((request) => ({
  id: `ip:${getIP(request)}`,
  count: increment,
  limit: 5,
  timeframe: 10,
}))

const increment: CountFn = async ({ response, key, timeframe }) => {
  // Latency logging
  const start = Date.now()

  const results = await upstashRest(
    [
      ['INCR', key],
      ['EXPIRE', key, timeframe],
    ],
    { pipeline: true }
  )

  // Temporal logging
  const latency = Date.now() - start
  response.headers.set('x-upstash-latency', `${latency}`)

  return results[0].result
}
