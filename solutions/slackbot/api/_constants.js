import { Redis } from '@upstash/redis'

export const token = process.env.SLACK_BOT_TOKEN
export const signingSecret = process.env.SLACK_SIGNING_SECRET

const redisURL = process.env.UPSTASH_REDIS_REST_URL
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN

export const redis = new Redis({
  url: redisURL,
  token: redisToken,
})
