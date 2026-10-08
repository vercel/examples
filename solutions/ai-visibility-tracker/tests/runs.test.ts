import { eq } from 'drizzle-orm'
import { beforeAll, describe, expect, it } from 'vitest'
import { createPgliteDb, type Database } from '@/lib/db'
import {
  answers,
  brandMentions,
  brands,
  questions,
  runs,
} from '@/lib/db/schema'
import { createRun } from '@/lib/runs/create'
import { processRun } from '@/lib/runs/process'
import type { QueryInput, QueryResult } from '@/lib/ai/query'
import type { ExtractInput, ExtractedBrand } from '@/lib/ai/extract'

let db: Database

beforeAll(async () => {
  db = await createPgliteDb('memory://')
})

async function seedBrand() {
  const [brand] = await db
    .insert(brands)
    .values({
      name: 'Acme',
      aliases: ['Acme Analytics'],
      domain: 'acme.com',
      platforms: ['chatgpt', 'perplexity'],
    })
    .returning()
  const inserted = await db
    .insert(questions)
    .values([
      { brandId: brand.id, text: 'best analytics tools', cadence: 'daily' },
      { brandId: brand.id, text: 'acme alternatives', cadence: 'weekly' },
    ])
    .returning()
  return { brand, questions: inserted }
}

const fakeQuery = async (input: QueryInput): Promise<QueryResult> => {
  if (
    input.platform === 'perplexity' &&
    input.question.includes('alternatives')
  ) {
    return {
      ok: false,
      error: 'boom',
      modelId: 'perplexity/sonar',
      durationMs: 5,
    }
  }
  const text =
    input.platform === 'chatgpt'
      ? 'Top tools: Acme Analytics leads, then Beta Metrics. See https://acme.com/docs'
      : 'Beta Metrics and Gamma are the usual picks.'
  return {
    ok: true,
    text,
    sources: [{ url: 'https://beta.io/compare', title: 'Compare' }],
    searchQueries: ['best analytics tools'],
    modelId: `${input.platform}/model`,
    providerModelId: null,
    inputTokens: 10,
    outputTokens: 20,
    durationMs: 12,
  }
}

const fakeExtract = async (input: ExtractInput): Promise<ExtractedBrand[]> => {
  const rows: ExtractedBrand[] = [
    {
      name: 'Beta Metrics',
      key: 'betametrics',
      matchedNames: ['Beta Metrics'],
      website: 'beta.io',
      sentiment: 'positive',
      recommended: true,
      isCompetitor: true,
      isSelf: false,
      highlights: ['Great dashboards'],
    },
  ]
  if (input.answerText.includes('Acme')) {
    rows.push({
      name: 'Acme',
      key: 'acme',
      matchedNames: ['Acme Analytics'],
      website: 'acme.com',
      sentiment: 'positive',
      recommended: true,
      isCompetitor: false,
      isSelf: true,
      highlights: ['Leads the list'],
    })
  }
  if (input.answerText.includes('Gamma')) {
    rows.push({
      name: 'Gamma',
      key: 'gamma',
      matchedNames: ['Gamma'],
      website: null,
      sentiment: 'neutral',
      recommended: false,
      isCompetitor: true,
      isSelf: false,
      highlights: [],
    })
  }
  return rows
}

describe('runs', () => {
  it('creates one answer per question and platform, processes them and finalizes', async () => {
    const { brand, questions: qs } = await seedBrand()
    const created = await createRun(db, {
      brandId: brand.id,
      trigger: 'manual',
      platforms: ['chatgpt', 'perplexity'],
    })
    expect(created.totalItems).toBe(4)

    const outcome = await processRun(db, created.runId, {
      budgetMs: 10_000,
      concurrency: 2,
      deps: { query: fakeQuery, extract: fakeExtract, log: () => undefined },
    })
    expect(outcome).toMatchObject({
      status: 'completed',
      done: 3,
      failed: 1,
      remaining: 0,
    })

    const stored = await db
      .select()
      .from(answers)
      .where(eq(answers.runId, created.runId))
      .orderBy(answers.id)
    const chatgpt = stored.filter((a) => a.platform === 'chatgpt')
    expect(
      chatgpt.every(
        (a) => a.brandMentioned && a.brandCited && a.brandPosition === 1
      )
    ).toBe(true)
    expect(chatgpt[0].brandsNamed).toBe(2)
    expect(chatgpt[0].sources).toEqual([
      { url: 'https://beta.io/compare', title: 'Compare' },
    ])

    const perplexityOk = stored.find(
      (a) => a.platform === 'perplexity' && a.status === 'done'
    )!
    expect(perplexityOk.brandMentioned).toBe(false)
    expect(perplexityOk.brandPosition).toBeNull()
    expect(perplexityOk.brandsNamed).toBe(2)

    const failed = stored.find((a) => a.status === 'failed')!
    expect(failed.error).toBe('boom')

    const mentions = await db
      .select()
      .from(brandMentions)
      .where(eq(brandMentions.runId, created.runId))
    const selfRows = mentions.filter((m) => m.isSelf)
    expect(selfRows).toHaveLength(2)
    expect(selfRows.every((m) => m.position === 1 && !m.isCompetitor)).toBe(
      true
    )
    const beta = mentions.filter((m) => m.key === 'betametrics')
    expect(beta).toHaveLength(3)
    expect(beta.find((m) => m.platform === 'chatgpt')?.position).toBe(2)

    const [run] = await db.select().from(runs).where(eq(runs.id, created.runId))
    expect(run.status).toBe('completed')
    expect(run.doneItems).toBe(3)
    expect(run.finishedAt).not.toBeNull()

    const refreshed = await db
      .select()
      .from(questions)
      .where(eq(questions.brandId, brand.id))
      .orderBy(questions.id)
    expect(refreshed.map((q) => q.lastRunAt !== null)).toEqual([true, true])
    expect(qs).toHaveLength(2)
  })

  it('stops at the budget and reports remaining work; a later call finishes it', async () => {
    const { brand } = await seedBrand()
    const created = await createRun(db, {
      brandId: brand.id,
      trigger: 'scheduled',
      platforms: ['chatgpt'],
    })
    const first = await processRun(db, created.runId, {
      budgetMs: 0,
      deps: { query: fakeQuery, extract: null, log: () => undefined },
    })
    expect(first.remaining).toBe(2)
    expect(first.status).toBe('running')

    const second = await processRun(db, created.runId, {
      budgetMs: 10_000,
      deps: { query: fakeQuery, extract: null, log: () => undefined },
    })
    expect(second).toMatchObject({
      status: 'completed',
      done: 2,
      failed: 0,
      remaining: 0,
    })
    const mentions = await db
      .select()
      .from(brandMentions)
      .where(eq(brandMentions.runId, created.runId))
    expect(mentions).toHaveLength(0)
  })

  it('completes immediately when nothing is due', async () => {
    const { brand } = await seedBrand()
    const created = await createRun(db, {
      brandId: brand.id,
      trigger: 'scheduled',
      platforms: ['chatgpt'],
      questionIds: [],
    })
    expect(created.totalItems).toBe(0)
    const [run] = await db.select().from(runs).where(eq(runs.id, created.runId))
    expect(run.status).toBe('completed')
  })
})
