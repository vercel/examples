import type { CountFunction } from './rate-limit'
import { upstashRest } from './upstash'

export const increment: CountFunction = async ({ key, timeframe }) => {
  const results = await upstashRest(
    [
      ['INCR', key],
      ['EXPIRE', key, timeframe],
    ],
    { pipeline: true }
  )
  return results[0].result
}

export default increment
