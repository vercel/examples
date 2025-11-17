import { PrismaClient } from '../prisma/generated/client'
import { PrismaPg } from '@prisma/adapter-pg'

declare global {
  var prisma: PrismaClient | undefined
}

const adapter = new PrismaPg({
  connectionString: process.env.POSTGRES_PRISMA_URL!,
})

const prisma =
  global.prisma ||
  new PrismaClient({
    adapter,
  })

if (process.env.NODE_ENV === 'development') global.prisma = prisma

export default prisma
