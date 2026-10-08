import { asc } from 'drizzle-orm'
import type { Database } from '@/lib/db'
import { brands, type Brand } from '@/lib/db/schema'

/** The app tracks one brand: the first row. */
export async function getBrand(db: Database): Promise<Brand | null> {
  const [brand] = await db
    .select()
    .from(brands)
    .orderBy(asc(brands.id))
    .limit(1)
  return brand ?? null
}
