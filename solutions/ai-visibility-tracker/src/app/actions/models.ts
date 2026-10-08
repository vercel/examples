'use server'

import { revalidatePath } from 'next/cache'
import { writeDenied } from '@/lib/auth/session'
import { getDb } from '@/lib/db'
import {
  EXTRACTOR_KEY,
  PLATFORMS,
  PLATFORM_IDS,
  isModelId,
} from '@/lib/platforms'
import { saveModelOverrides } from '@/lib/queries/settings'

export interface ModelsFormState {
  error: string | null
  saved: boolean
}

/** Saves the per-platform and extractor model ids. Empty fields fall back to the defaults. */
export async function saveModels(
  _previous: ModelsFormState,
  formData: FormData
): Promise<ModelsFormState> {
  const denied = await writeDenied()
  if (denied) return { error: denied, saved: false }

  const overrides: Record<string, string> = {}
  for (const key of [...PLATFORM_IDS, EXTRACTOR_KEY]) {
    const value = String(formData.get(`model_${key}`) ?? '').trim()
    if (!value) continue
    if (!isModelId(value)) {
      const label =
        key === EXTRACTOR_KEY
          ? 'Brand extraction'
          : PLATFORMS[key as (typeof PLATFORM_IDS)[number]].label
      return {
        error: `${label}: use a model id in the form creator/model, for example openai/gpt-5.4-nano.`,
        saved: false,
      }
    }
    overrides[key] = value
  }

  const db = await getDb()
  await saveModelOverrides(db, overrides)
  revalidatePath('/settings')
  revalidatePath('/setup')
  return { error: null, saved: true }
}
