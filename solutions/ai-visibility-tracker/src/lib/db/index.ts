import type { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core'
import * as schema from './schema'

export type Database = PgDatabase<PgQueryResultHKT, typeof schema>

export const MIGRATIONS_FOLDER = './drizzle'

type GlobalWithDb = typeof globalThis & { __aiVisibilityDb?: Promise<Database> }

export function databaseUrl(): string | null {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || null
}

/**
 * Returns the shared database handle. With DATABASE_URL set this is a
 * postgres.js pool (Neon, Supabase, any Postgres). Without it, an embedded
 * PGlite database under ./data/pglite keeps local development dependency-free.
 */
export function getDb(): Promise<Database> {
  const g = globalThis as GlobalWithDb
  if (!g.__aiVisibilityDb) {
    g.__aiVisibilityDb = createDb().catch((error) => {
      g.__aiVisibilityDb = undefined
      throw error
    })
  }
  return g.__aiVisibilityDb
}

async function createDb(): Promise<Database> {
  const url = databaseUrl()
  if (url) {
    const { drizzle } = await import('drizzle-orm/postgres-js')
    const postgres = (await import('postgres')).default
    const client = postgres(url, { max: 5, prepare: false })
    return drizzle(client, { schema }) as unknown as Database
  }
  return createPgliteDb(process.env.PGLITE_DATA_DIR ?? './data/pglite')
}

/** Embedded Postgres (WASM). `memory://` gives an in-memory database for tests. */
export async function createPgliteDb(dataDir: string): Promise<Database> {
  const { drizzle } = await import('drizzle-orm/pglite')
  const { migrate } = await import('drizzle-orm/pglite/migrator')
  const { PGlite } = await import('@electric-sql/pglite')
  const client = new PGlite(dataDir)
  const db = drizzle(client, { schema })
  await migrate(db, { migrationsFolder: MIGRATIONS_FOLDER })
  return db as unknown as Database
}
