import { after } from 'next/server'
import { availablePlatforms } from '@/lib/ai/provider'
import { getDb } from '@/lib/db'
import { isDemoMode } from '@/lib/demo'
import { isInternalRequest, runBatchBudgetMs } from '@/lib/env'
import { normalizePlatformList } from '@/lib/platforms'
import { getBrand } from '@/lib/queries/brand'
import { activeRun } from '@/lib/queries/runs'
import { getModelConfig } from '@/lib/queries/settings'
import { createRun } from '@/lib/runs/create'
import { processRun } from '@/lib/runs/process'
import { isQuestionDue } from '@/lib/runs/schedule'
import { triggerRunProcessing } from '@/lib/runs/trigger'
import { questions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export const maxDuration = 300
export const dynamic = 'force-dynamic'

/** Daily scheduled check (vercel.json). Vercel Cron sends `Authorization: Bearer $CRON_SECRET`. */
export async function GET(request: Request): Promise<Response> {
  if (!process.env.CRON_SECRET) {
    return Response.json(
      { error: 'CRON_SECRET is not configured' },
      { status: 500 }
    )
  }
  if (!isInternalRequest(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (isDemoMode()) return Response.json({ skipped: 'demo mode' })

  const db = await getDb()
  const brand = await getBrand(db)
  if (!brand) return Response.json({ skipped: 'no brand configured' })

  const running = await activeRun(db, brand.id)
  if (running)
    return Response.json({
      skipped: 'a run is already in progress',
      runId: running.id,
    })

  const now = new Date()
  const due = (
    await db.select().from(questions).where(eq(questions.brandId, brand.id))
  ).filter((q) => isQuestionDue(q, now))
  if (due.length === 0) return Response.json({ skipped: 'no questions due' })

  const available = new Set(availablePlatforms(await getModelConfig(db)))
  const platforms = normalizePlatformList(brand.platforms).filter((p) =>
    available.has(p)
  )
  const { runId, totalItems } = await createRun(db, {
    brandId: brand.id,
    trigger: 'scheduled',
    platforms,
    questionIds: due.map((q) => q.id),
  })

  const origin = new URL(request.url).origin
  after(async () => {
    try {
      const outcome = await processRun(db, runId, {
        budgetMs: runBatchBudgetMs(),
      })
      if (outcome.remaining > 0) await triggerRunProcessing(runId, origin)
    } catch (error) {
      console.error(`[cron] processing run ${runId} failed`, error)
    }
  })

  return Response.json({ runId, totalItems, questions: due.length, platforms })
}
