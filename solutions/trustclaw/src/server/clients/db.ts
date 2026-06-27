import { PrismaClient } from '~/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { env } from '~/env'

function ensureVerifyFullSsl(url: string): string {
  const parsed = new URL(url)
  if (parsed.searchParams.get('sslmode') !== 'verify-full') {
    parsed.searchParams.set('sslmode', 'verify-full')
  }
  return parsed.toString()
}

const createPrismaClient = () => {
  const adapter = new PrismaPg({
    connectionString: ensureVerifyFullSsl(env.DATABASE_URL),
  })

  return new PrismaClient({
    adapter,
    log:
      env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

const globalForPrisma = globalThis as typeof globalThis & {
  prisma: ReturnType<typeof createPrismaClient> | undefined
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = db
