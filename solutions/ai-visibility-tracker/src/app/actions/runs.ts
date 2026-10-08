'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { availablePlatforms } from '@/lib/ai/provider'
import { writeDenied } from '@/lib/auth/session'
import { getDb } from '@/lib/db'
import { normalizePlatformList } from '@/lib/platforms'
import { getBrand } from '@/lib/queries/brand'
import { activeRun } from '@/lib/queries/runs'
import { getModelConfig } from '@/lib/queries/settings'
import { createRun } from '@/lib/runs/create'
import { triggerRunProcessing } from '@/lib/runs/trigger'
import { currentOrigin } from '@/lib/request'

/** "Run now": checks every active question on every enabled, available platform. */
export async function startRun(): Promise<void> {
  if (await writeDenied()) redirect('/')
  const db = await getDb()
  const brand = await getBrand(db)
  if (!brand) redirect('/setup')

  const running = await activeRun(db, brand.id)
  if (running) redirect(`/runs/${running.id}`)

  const available = new Set(availablePlatforms(await getModelConfig(db)))
  const platforms = normalizePlatformList(brand.platforms).filter((p) =>
    available.has(p)
  )
  const { runId, totalItems } = await createRun(db, {
    brandId: brand.id,
    trigger: 'manual',
    platforms,
  })
  if (totalItems > 0) {
    await triggerRunProcessing(runId, await currentOrigin())
  }
  revalidatePath('/')
  redirect(`/runs/${runId}`)
}

/** Re-triggers processing for a run that stopped with pending work. */
export async function resumeRun(formData: FormData): Promise<void> {
  if (await writeDenied()) redirect('/')
  const runId = Number(formData.get('runId'))
  if (!Number.isInteger(runId)) return
  await triggerRunProcessing(runId, await currentOrigin())
  redirect(`/runs/${runId}`)
}
