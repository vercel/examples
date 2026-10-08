import { asc, eq } from 'drizzle-orm'
import type { Database } from '@/lib/db'
import { settings } from '@/lib/db/schema'
import { resolveModelConfig, type ModelConfig } from '@/lib/platforms'

/** Stored model overrides, or an empty map when nothing was saved yet. */
export async function getModelOverrides(
  db: Database
): Promise<Record<string, string>> {
  const [row] = await db
    .select({ models: settings.models })
    .from(settings)
    .orderBy(asc(settings.id))
    .limit(1)
  return row?.models ?? {}
}

/** Effective models: database overrides, then environment overrides, then the built-in defaults. */
export async function getModelConfig(db: Database): Promise<ModelConfig> {
  return resolveModelConfig(await getModelOverrides(db))
}

/** Replaces the stored overrides. Keys with empty values fall back to the defaults. */
export async function saveModelOverrides(
  db: Database,
  overrides: Record<string, string>
): Promise<void> {
  const cleaned: Record<string, string> = {}
  for (const [key, value] of Object.entries(overrides)) {
    const trimmed = value.trim()
    if (trimmed) cleaned[key] = trimmed
  }
  const [row] = await db
    .select({ id: settings.id })
    .from(settings)
    .orderBy(asc(settings.id))
    .limit(1)
  if (row) {
    await db
      .update(settings)
      .set({ models: cleaned, updatedAt: new Date() })
      .where(eq(settings.id, row.id))
  } else {
    await db.insert(settings).values({ models: cleaned })
  }
}
