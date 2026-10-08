import { after } from 'next/server'
import { isAuthenticated } from '@/lib/auth/session'
import { getDb } from '@/lib/db'
import { isDemoMode } from '@/lib/demo'
import { isInternalRequest, runBatchBudgetMs } from '@/lib/env'
import { processRun } from '@/lib/runs/process'
import { triggerRunProcessing } from '@/lib/runs/trigger'

/** Vercel Hobby functions stop at 300 s; the batch budget leaves room for in-flight calls. */
export const maxDuration = 300
export const dynamic = 'force-dynamic'

/**
 * Processes one batch of a run after answering immediately, then re-invokes
 * itself while work remains. Authenticated with the shared secret (cron,
 * self-invocation) or the admin session (manual resume).
 */
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  if (!isInternalRequest(request) && !(await isAuthenticated())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (isDemoMode()) return Response.json({ skipped: 'demo mode' })
  const { id } = await context.params
  const runId = Number(id)
  if (!Number.isInteger(runId) || runId <= 0) {
    return Response.json({ error: 'Invalid run id' }, { status: 400 })
  }
  const origin = new URL(request.url).origin

  after(async () => {
    try {
      const db = await getDb()
      const outcome = await processRun(db, runId, {
        budgetMs: runBatchBudgetMs(),
      })
      if (outcome.remaining > 0) {
        await triggerRunProcessing(runId, origin)
      }
    } catch (error) {
      console.error(`[run] processing run ${runId} failed`, error)
    }
  })

  return Response.json({ accepted: true, runId }, { status: 202 })
}
