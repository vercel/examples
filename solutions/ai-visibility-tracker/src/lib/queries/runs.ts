import { and, desc, eq, inArray } from 'drizzle-orm'
import type { Database } from '@/lib/db'
import { answers, questions, runs, type Run } from '@/lib/db/schema'

export async function listRuns(
  db: Database,
  brandId: number,
  limit = 10
): Promise<Run[]> {
  return db
    .select()
    .from(runs)
    .where(eq(runs.brandId, brandId))
    .orderBy(desc(runs.id))
    .limit(limit)
}

export async function activeRun(
  db: Database,
  brandId: number
): Promise<Run | null> {
  const [run] = await db
    .select()
    .from(runs)
    .where(
      and(
        eq(runs.brandId, brandId),
        inArray(runs.status, ['queued', 'running'])
      )
    )
    .orderBy(desc(runs.id))
    .limit(1)
  return run ?? null
}

export interface RunProgressItem {
  id: number
  platform: string
  questionId: number
  questionText: string
  status: string
  brandMentioned: boolean
  brandCited: boolean
  error: string | null
}

export interface RunProgress {
  run: Run
  items: RunProgressItem[]
}

export async function runProgress(
  db: Database,
  brandId: number,
  runId: number
): Promise<RunProgress | null> {
  const [run] = await db
    .select()
    .from(runs)
    .where(and(eq(runs.id, runId), eq(runs.brandId, brandId)))
    .limit(1)
  if (!run) return null
  const items = await db
    .select({
      id: answers.id,
      platform: answers.platform,
      questionId: answers.questionId,
      questionText: questions.text,
      status: answers.status,
      brandMentioned: answers.brandMentioned,
      brandCited: answers.brandCited,
      error: answers.error,
    })
    .from(answers)
    .innerJoin(questions, eq(questions.id, answers.questionId))
    .where(eq(answers.runId, runId))
    .orderBy(answers.questionId, answers.id)
  return { run, items }
}
