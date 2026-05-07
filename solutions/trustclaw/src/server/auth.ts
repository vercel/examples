import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'
import { username } from 'better-auth/plugins'
import { db } from '~/server/clients/db'
import { env } from '~/env'
import { getRedis, isRedisConfigured } from './clients/redis'
import { z } from 'zod'

const rateLimitValueSchema = z.object({
  count: z.coerce.number(),
  lastRequest: z.coerce.number(),
})

const redisRateLimitStorage = isRedisConfigured()
  ? {
      customStorage: {
        get: async (key: string) => {
          const redis = getRedis()
          const value = redis ? await redis.get(key) : null
          const parsedValue = value
            ? rateLimitValueSchema.parse(JSON.parse(value))
            : null
          return {
            key,
            count: parsedValue?.count ?? 0,
            lastRequest: parsedValue?.lastRequest ?? 0,
          }
        },
        set: async (
          key: string,
          value: { count: number; lastRequest: number }
        ) => {
          const redis = getRedis()
          if (!redis) return
          await redis.set(key, JSON.stringify(value), 'EX', 60)
        },
      },
    }
  : {}

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.NEXT_PUBLIC_APP_URL,
  trustedOrigins: [
    env.NEXT_PUBLIC_APP_URL,
    ...(process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`]
      : []),
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
  ],
  database: prismaAdapter(db, { provider: 'postgresql' }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  emailVerification: {
    sendOnSignUp: false,
  },
  plugins: [username(), nextCookies()],
  session: {
    expiresIn: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
    customRules: {
      '/sign-in/username': {
        window: 10,
        max: 5,
      },
      '/sign-up/email': {
        window: 60,
        max: 5,
      },
    },
    ...redisRateLimitStorage,
  },
  advanced: {
    ipAddress: {
      ipAddressHeaders: ['x-forwarded-for', 'x-real-ip'],
    },
  },
})

export type Session = typeof auth.$Infer.Session
