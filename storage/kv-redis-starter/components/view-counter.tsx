import { Redis } from '@upstash/redis'

export default async function ViewCounter() {
  const redis = new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  })
  const views = await redis.incr('views')

  return (
    <p className="text-sm text-gray-500">
      {Intl.NumberFormat('en-us').format(views)} views
    </p>
  )
}
