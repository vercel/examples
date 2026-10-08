/**
 * Applies the SQL migrations in ./drizzle. Runs before `next build` and via
 * `npm run db:migrate`. With DATABASE_URL it migrates that Postgres; without
 * it, the local PGlite database.
 */
import { config as loadEnv } from 'dotenv'
import { MIGRATIONS_FOLDER, databaseUrl } from './index'

loadEnv({ path: ['.env.local', '.env'], quiet: true })

async function main(): Promise<void> {
  const url = databaseUrl()
  if (url) {
    const { drizzle } = await import('drizzle-orm/postgres-js')
    const { migrate } = await import('drizzle-orm/postgres-js/migrator')
    const postgres = (await import('postgres')).default
    const client = postgres(url, { max: 1, prepare: false })
    try {
      await migrate(drizzle(client), { migrationsFolder: MIGRATIONS_FOLDER })
      console.log('Database migrated (Postgres).')
    } finally {
      await client.end()
    }
    return
  }
  const { drizzle } = await import('drizzle-orm/pglite')
  const { migrate } = await import('drizzle-orm/pglite/migrator')
  const { PGlite } = await import('@electric-sql/pglite')
  const client = new PGlite(process.env.PGLITE_DATA_DIR ?? './data/pglite')
  await migrate(drizzle(client), { migrationsFolder: MIGRATIONS_FOLDER })
  await client.close()
  console.log('Database migrated (embedded PGlite).')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
