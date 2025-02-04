import { createClient } from "redis";

export default async function ViewCounter() {
  const redis = await createClient({
    url: process.env.REDIS_URL ?? process.env.KV_URL,
  }).connect();
  const views = await redis.incr('views')

  return (
    <p className="text-sm text-gray-500">
      {Intl.NumberFormat('en-us').format(views)} views
    </p>
  )
}
