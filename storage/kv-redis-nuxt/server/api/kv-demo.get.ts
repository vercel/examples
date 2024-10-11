import Redis from 'ioredis'

export default eventHandler(async () => {
  if (!process.env.KV_URL) {
    throw new Error(
      'KV_URL is not set. It is either not set on your Vercel project or is not being pulled in the GitHub Actions workflow.'
    )
  }
  const redis = new Redis(process.env.KV_URL)
  const pageVisits = Number.parseInt((await redis.get('pageVisits')) || '0')

  const updatedPageVisits = pageVisits + 1
  await redis.set('pageVisits', updatedPageVisits)
  return {
    pageVisits: updatedPageVisits,
  }
})
