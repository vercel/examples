import { Redis } from '@upstash/redis'

export default eventHandler(async () => {
  const redis = new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  })
  const views = await redis.incr('views')

  return {
    pageVisits: views,
  }
})
