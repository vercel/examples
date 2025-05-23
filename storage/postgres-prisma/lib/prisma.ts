import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { createPool } from '@vercel/postgres'

declare global {
  var prisma: PrismaClient | undefined
}

// Caveats:
// 1. "@prisma/adapter-neon" warns of missing peer dependency "@neondatabase/serverless".
// 2. Trying to build with pnpm and without `autoInstallPeers` fails without the `@neondatabase/serverless` peer dependency.
// 3. Adapter is called "PrismaNeon" which might be confusing. "PrismaVercelPostgres" would be preferred.

const pool = createPool()
const adapter = new PrismaNeon(pool);
const prisma = global.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV === 'development') global.prisma = prisma

export default prisma
