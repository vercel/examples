import { and, eq, inArray } from 'drizzle-orm'
import type { Database } from '@/lib/db'
import { answers, questions, runs, type RunTrigger } from '@/lib/db/schema'
import type { PlatformId } from '@/lib/platforms'

export interface CreateRunInput {
  brandId: number
  trigger: RunTrigger
  platforms: PlatformId[]
  /** Restrict to these questions; defaults to every active question. */
  questionIds?: number[]
}

export interface CreatedRun {
  runId: number
  totalItems: number
}

/** Inserts a run and one pending answer per question × platform. */
export async function createRun(
  db: Database,
  input: CreateRunInput
): Promise<CreatedRun> {
  const conditions = [
    eq(questions.brandId, input.brandId),
    eq(questions.isActive, true),
  ]
  if (input.questionIds && input.questionIds.length > 0) {
    conditions.push(inArray(questions.id, input.questionIds))
  }
  const dueQuestions =
    input.questionIds?.length === 0
      ? []
      : await db
          .select()
          .from(questions)
          .where(and(...conditions))
  const items = dueQuestions.flatMap((question) =>
    input.platforms.map((platform) => ({ questionId: question.id, platform }))
  )

  if (items.length === 0) {
    const [run] = await db
      .insert(runs)
      .values({
        brandId: input.brandId,
        trigger: input.trigger,
        status: 'completed',
        totalItems: 0,
        startedAt: new Date(),
        finishedAt: new Date(),
      })
      .returning({ id: runs.id })
    return { runId: run.id, totalItems: 0 }
  }

  const [run] = await db
    .insert(runs)
    .values({
      brandId: input.brandId,
      trigger: input.trigger,
      status: 'queued',
      totalItems: items.length,
    })
    .returning({ id: runs.id })

  await db.insert(answers).values(
    items.map((item) => ({
      runId: run.id,
      questionId: item.questionId,
      brandId: input.brandId,
      platform: item.platform,
      status: 'pending' as const,
    }))
  )

  return { runId: run.id, totalItems: items.length }
}
