import { and, eq, inArray, lt, sql } from 'drizzle-orm'
import type { Database } from '@/lib/db'
import {
  answers,
  brandMentions,
  brands,
  questions,
  runs,
  type Answer,
  type Brand,
  type Question,
  type RunStatus,
} from '@/lib/db/schema'
import {
  extractBrands,
  type ExtractInput,
  type ExtractedBrand,
} from '@/lib/ai/extract'
import { extractorAvailability } from '@/lib/ai/provider'
import {
  queryPlatform,
  type QueryInput,
  type QueryResult,
} from '@/lib/ai/query'
import {
  detectCitation,
  findMentions,
  rankBrands,
} from '@/lib/analysis/mentions'
import { isPlatformId, type ModelConfig } from '@/lib/platforms'
import { getModelConfig } from '@/lib/queries/settings'

export interface ProcessDeps {
  query: (input: QueryInput) => Promise<QueryResult>
  /** Null disables competitor extraction (no model available). */
  extract: ((input: ExtractInput) => Promise<ExtractedBrand[]>) | null
  now: () => Date
  log: (message: string, meta?: Record<string, unknown>) => void
}

export interface ProcessOptions {
  /** Wall-clock budget for claiming new work in this invocation. */
  budgetMs?: number
  concurrency?: number
  deps?: Partial<ProcessDeps>
}

export interface ProcessOutcome {
  runId: number
  status: RunStatus
  done: number
  failed: number
  remaining: number
}

const SELF_KEY = '__self__'
/** An answer still "running" this long after being claimed belongs to a dead invocation. */
const STALE_RUNNING_MS = 10 * 60_000
const MAX_ATTEMPTS = 2

function defaultDeps(models: ModelConfig): ProcessDeps {
  return {
    query: queryPlatform,
    extract: extractorAvailability(models.extractor).available
      ? extractBrands
      : null,
    now: () => new Date(),
    log: (message, meta) => console.log(`[run] ${message}`, meta ?? ''),
  }
}

/**
 * Processes pending answers of a run until the time budget is spent, then
 * reports how many remain so the caller can schedule another invocation.
 * Safe to call repeatedly: work is claimed atomically and stale claims from a
 * killed invocation are retried once.
 */
export async function processRun(
  db: Database,
  runId: number,
  options: ProcessOptions = {}
): Promise<ProcessOutcome> {
  const models = await getModelConfig(db)
  const deps: ProcessDeps = { ...defaultDeps(models), ...options.deps }
  const budgetMs = options.budgetMs ?? 140_000
  const concurrency = Math.max(1, options.concurrency ?? 4)
  const startedAt = Date.now()

  const [run] = await db.select().from(runs).where(eq(runs.id, runId)).limit(1)
  if (!run) throw new Error(`Run ${runId} not found`)
  if (run.status === 'completed' || run.status === 'failed') {
    return {
      runId,
      status: run.status,
      done: run.doneItems,
      failed: run.failedItems,
      remaining: 0,
    }
  }

  const [brand] = await db
    .select()
    .from(brands)
    .where(eq(brands.id, run.brandId))
    .limit(1)
  if (!brand) throw new Error(`Brand ${run.brandId} not found`)

  await db
    .update(runs)
    .set({ status: 'running', startedAt: run.startedAt ?? deps.now() })
    .where(eq(runs.id, runId))

  await recoverStaleClaims(db, runId, deps.now())

  const questionCache = new Map<number, Question>()
  while (Date.now() - startedAt < budgetMs) {
    const claimed = await claimAnswers(db, runId, concurrency, deps.now())
    if (claimed.length === 0) break
    await Promise.all(
      claimed.map(async (answer) => {
        const question = await loadQuestion(
          db,
          questionCache,
          answer.questionId
        )
        try {
          await processAnswer(db, answer, brand, question, deps, models)
        } catch (error) {
          deps.log('answer failed unexpectedly', {
            answerId: answer.id,
            error: String(error),
          })
          await markFailed(
            db,
            answer.id,
            answer.modelId,
            `Unexpected error: ${String(error).slice(0, 500)}`,
            deps.now()
          )
        }
      })
    )
    await refreshCounters(db, runId)
  }

  return finalizeIfComplete(db, runId, deps.now())
}

async function loadQuestion(
  db: Database,
  cache: Map<number, Question>,
  id: number
): Promise<Question> {
  const cached = cache.get(id)
  if (cached) return cached
  const [question] = await db
    .select()
    .from(questions)
    .where(eq(questions.id, id))
    .limit(1)
  if (!question) throw new Error(`Question ${id} not found`)
  cache.set(id, question)
  return question
}

async function recoverStaleClaims(
  db: Database,
  runId: number,
  now: Date
): Promise<void> {
  const cutoff = new Date(now.getTime() - STALE_RUNNING_MS)
  const stale = and(
    eq(answers.runId, runId),
    eq(answers.status, 'running'),
    lt(answers.startedAt, cutoff)
  )
  await db
    .update(answers)
    .set({
      status: 'failed',
      error: 'Timed out after the maximum number of attempts.',
      completedAt: now,
    })
    .where(and(stale, sql`${answers.attempts} >= ${MAX_ATTEMPTS}`))
  await db
    .update(answers)
    .set({ status: 'pending', startedAt: null })
    .where(and(stale, sql`${answers.attempts} < ${MAX_ATTEMPTS}`))
}

async function claimAnswers(
  db: Database,
  runId: number,
  limit: number,
  now: Date
): Promise<Answer[]> {
  const candidates = db
    .select({ id: answers.id })
    .from(answers)
    .where(and(eq(answers.runId, runId), eq(answers.status, 'pending')))
    .orderBy(answers.id)
    .limit(limit)
  return db
    .update(answers)
    .set({
      status: 'running',
      startedAt: now,
      attempts: sql`${answers.attempts} + 1`,
    })
    .where(and(inArray(answers.id, candidates), eq(answers.status, 'pending')))
    .returning()
}

async function processAnswer(
  db: Database,
  answer: Answer,
  brand: Brand,
  question: Question,
  deps: ProcessDeps,
  models: ModelConfig
): Promise<void> {
  if (!isPlatformId(answer.platform)) {
    await markFailed(
      db,
      answer.id,
      null,
      `Unknown platform "${answer.platform}"`,
      deps.now()
    )
    return
  }

  const result = await deps.query({
    platform: answer.platform,
    question: question.text,
    country: brand.country,
    language: brand.language,
    modelId: models.platforms[answer.platform],
  })

  if (!result.ok) {
    await markFailed(
      db,
      answer.id,
      result.modelId,
      result.error,
      deps.now(),
      result.durationMs
    )
    return
  }

  const names = [brand.name, ...brand.aliases].filter(
    (n) => n.trim().length > 0
  )
  const mentions = findMentions(result.text, names)
  const citation = detectCitation(result.text, result.sources, brand.domain)

  let extracted: ExtractedBrand[] = []
  if (deps.extract) {
    try {
      extracted = await deps.extract({
        question: question.text,
        answerText: result.text,
        citations: result.sources.map((s) => s.url),
        brandName: brand.name,
        brandAliases: brand.aliases,
        brandDomain: brand.domain,
        modelId: models.extractor,
      })
    } catch (error) {
      deps.log(
        'brand extraction failed; storing the answer without competitors',
        {
          answerId: answer.id,
          error: String(error),
        }
      )
    }
  }

  const ranking = rankBrands(result.text, [
    { key: SELF_KEY, names },
    ...extracted
      .filter((b) => !b.isSelf)
      .map((b) => ({
        key: b.key,
        names: b.matchedNames.length > 0 ? b.matchedNames : [b.name],
      })),
  ])
  const selfPosition = mentions.count > 0 ? ranking.get(SELF_KEY) ?? 1 : null

  const completedAt = deps.now()
  if (extracted.length > 0) {
    await db.insert(brandMentions).values(
      extracted.map((b) => ({
        answerId: answer.id,
        runId: answer.runId,
        brandId: brand.id,
        platform: answer.platform,
        name: b.name,
        key: b.key,
        website: b.website,
        sentiment: b.sentiment,
        recommended: b.recommended,
        isCompetitor: b.isCompetitor,
        isSelf: b.isSelf,
        position: b.isSelf ? selfPosition : ranking.get(b.key) ?? null,
        highlights: b.highlights,
      }))
    )
  }

  await db
    .update(answers)
    .set({
      status: 'done',
      text: result.text,
      sources: result.sources,
      searchQueries: result.searchQueries,
      modelId: result.modelId,
      providerModelId: result.providerModelId,
      brandMentioned: mentions.count > 0,
      brandCited: citation.cited,
      mentionCount: mentions.count,
      brandPosition: selfPosition,
      brandsNamed: ranking.size,
      inputTokens: result.inputTokens,
      outputTokens: result.outputTokens,
      durationMs: result.durationMs,
      error: null,
      completedAt,
    })
    .where(eq(answers.id, answer.id))
}

async function markFailed(
  db: Database,
  answerId: number,
  modelId: string | null,
  error: string,
  now: Date,
  durationMs?: number
): Promise<void> {
  await db
    .update(answers)
    .set({
      status: 'failed',
      modelId,
      error: error.slice(0, 2000),
      durationMs: durationMs ?? null,
      completedAt: now,
    })
    .where(eq(answers.id, answerId))
}

interface Counters {
  done: number
  failed: number
  pending: number
  running: number
}

async function counters(db: Database, runId: number): Promise<Counters> {
  const [row] = await db
    .select({
      done: sql<number>`count(*) filter (where ${answers.status} = 'done')`.mapWith(
        Number
      ),
      failed:
        sql<number>`count(*) filter (where ${answers.status} = 'failed')`.mapWith(
          Number
        ),
      pending:
        sql<number>`count(*) filter (where ${answers.status} = 'pending')`.mapWith(
          Number
        ),
      running:
        sql<number>`count(*) filter (where ${answers.status} = 'running')`.mapWith(
          Number
        ),
    })
    .from(answers)
    .where(eq(answers.runId, runId))
  return row ?? { done: 0, failed: 0, pending: 0, running: 0 }
}

async function refreshCounters(db: Database, runId: number): Promise<Counters> {
  const current = await counters(db, runId)
  await db
    .update(runs)
    .set({ doneItems: current.done, failedItems: current.failed })
    .where(eq(runs.id, runId))
  return current
}

async function finalizeIfComplete(
  db: Database,
  runId: number,
  now: Date
): Promise<ProcessOutcome> {
  const current = await refreshCounters(db, runId)
  const remaining = current.pending + current.running
  if (remaining > 0) {
    return {
      runId,
      status: 'running',
      done: current.done,
      failed: current.failed,
      remaining,
    }
  }
  const status: RunStatus =
    current.done === 0 && current.failed > 0 ? 'failed' : 'completed'
  await db
    .update(runs)
    .set({ status, finishedAt: now })
    .where(eq(runs.id, runId))

  const answered = db
    .selectDistinct({ questionId: answers.questionId })
    .from(answers)
    .where(and(eq(answers.runId, runId), eq(answers.status, 'done')))
  await db
    .update(questions)
    .set({ lastRunAt: now })
    .where(inArray(questions.id, answered))

  return {
    runId,
    status,
    done: current.done,
    failed: current.failed,
    remaining: 0,
  }
}
