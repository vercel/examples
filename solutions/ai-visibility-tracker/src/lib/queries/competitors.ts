import { and, desc, eq, gte } from 'drizzle-orm'
import type { Database } from '@/lib/db'
import {
  answers,
  brandMentions,
  questions,
  type Sentiment,
} from '@/lib/db/schema'
import { percentage } from '@/lib/analysis/scoring'

export interface SentimentCounts {
  positive: number
  neutral: number
  negative: number
}

export interface CompetitorSummary {
  key: string
  name: string
  website: string | null
  /** Distinct answers naming the brand. */
  answers: number
  /** Share of all completed answers in the period. */
  share: number | null
  platforms: Record<string, number>
  avgPosition: number | null
  sentiment: SentimentCounts
  recommended: number
  lastSeenAt: Date | null
}

interface MentionRow {
  key: string
  name: string
  website: string | null
  platform: string
  answerId: number
  position: number | null
  sentiment: Sentiment
  recommended: boolean
  completedAt: Date | null
}

async function mentionRows(
  db: Database,
  brandId: number,
  since: Date,
  filter: { isSelf: boolean; key?: string }
): Promise<MentionRow[]> {
  const conditions = [
    eq(brandMentions.brandId, brandId),
    eq(brandMentions.isSelf, filter.isSelf),
    eq(answers.status, 'done'),
    gte(answers.completedAt, since),
  ]
  if (!filter.isSelf) conditions.push(eq(brandMentions.isCompetitor, true))
  if (filter.key) conditions.push(eq(brandMentions.key, filter.key))
  return db
    .select({
      key: brandMentions.key,
      name: brandMentions.name,
      website: brandMentions.website,
      platform: brandMentions.platform,
      answerId: brandMentions.answerId,
      position: brandMentions.position,
      sentiment: brandMentions.sentiment,
      recommended: brandMentions.recommended,
      completedAt: answers.completedAt,
    })
    .from(brandMentions)
    .innerJoin(answers, eq(answers.id, brandMentions.answerId))
    .where(and(...conditions))
}

export function summarizeMentions(
  rows: ReadonlyArray<MentionRow>,
  totalAnswers: number
): CompetitorSummary[] {
  const byKey = new Map<
    string,
    {
      names: Map<string, number>
      website: string | null
      answerIds: Set<number>
      platforms: Record<string, number>
      positions: number[]
      sentiment: SentimentCounts
      recommended: number
      lastSeenAt: Date | null
    }
  >()

  for (const row of rows) {
    let entry = byKey.get(row.key)
    if (!entry) {
      entry = {
        names: new Map(),
        website: null,
        answerIds: new Set(),
        platforms: {},
        positions: [],
        sentiment: { positive: 0, neutral: 0, negative: 0 },
        recommended: 0,
        lastSeenAt: null,
      }
      byKey.set(row.key, entry)
    }
    entry.names.set(row.name, (entry.names.get(row.name) ?? 0) + 1)
    entry.website = entry.website ?? row.website
    if (!entry.answerIds.has(row.answerId)) {
      entry.answerIds.add(row.answerId)
      entry.platforms[row.platform] = (entry.platforms[row.platform] ?? 0) + 1
    }
    if (row.position !== null) entry.positions.push(row.position)
    entry.sentiment[row.sentiment] += 1
    if (row.recommended) entry.recommended += 1
    if (
      row.completedAt &&
      (!entry.lastSeenAt || row.completedAt > entry.lastSeenAt)
    )
      entry.lastSeenAt = row.completedAt
  }

  return Array.from(byKey.entries())
    .map(([key, entry]) => ({
      key,
      name: Array.from(entry.names.entries()).sort((a, b) => b[1] - a[1])[0][0],
      website: entry.website,
      answers: entry.answerIds.size,
      share: percentage(entry.answerIds.size, totalAnswers),
      platforms: entry.platforms,
      avgPosition:
        entry.positions.length > 0
          ? Math.round(
              (entry.positions.reduce((a, b) => a + b, 0) /
                entry.positions.length) *
                10
            ) / 10
          : null,
      sentiment: entry.sentiment,
      recommended: entry.recommended,
      lastSeenAt: entry.lastSeenAt,
    }))
    .sort((a, b) => b.answers - a.answers || a.name.localeCompare(b.name))
}

export async function competitorSummaries(
  db: Database,
  brandId: number,
  since: Date,
  totalAnswers: number
): Promise<CompetitorSummary[]> {
  return summarizeMentions(
    await mentionRows(db, brandId, since, { isSelf: false }),
    totalAnswers
  )
}

export interface BrandHighlight {
  answerId: number
  platform: string
  questionText: string
  completedAt: Date | null
  sentiment: Sentiment
  recommended: boolean
  position: number | null
  highlights: string[]
}

/** Everything the platforms said about one brand (a competitor, or the tracked brand itself). */
export async function brandHighlights(
  db: Database,
  brandId: number,
  since: Date,
  filter: { isSelf: boolean; key?: string },
  limit = 60
): Promise<BrandHighlight[]> {
  const conditions = [
    eq(brandMentions.brandId, brandId),
    eq(brandMentions.isSelf, filter.isSelf),
    eq(answers.status, 'done'),
    gte(answers.completedAt, since),
  ]
  if (filter.key) conditions.push(eq(brandMentions.key, filter.key))
  return db
    .select({
      answerId: brandMentions.answerId,
      platform: brandMentions.platform,
      questionText: questions.text,
      completedAt: answers.completedAt,
      sentiment: brandMentions.sentiment,
      recommended: brandMentions.recommended,
      position: brandMentions.position,
      highlights: brandMentions.highlights,
    })
    .from(brandMentions)
    .innerJoin(answers, eq(answers.id, brandMentions.answerId))
    .innerJoin(questions, eq(questions.id, answers.questionId))
    .where(and(...conditions))
    .orderBy(desc(answers.completedAt), desc(brandMentions.id))
    .limit(limit)
}

export async function competitorDetail(
  db: Database,
  brandId: number,
  key: string,
  since: Date,
  totalAnswers: number
): Promise<{
  summary: CompetitorSummary | null
  highlights: BrandHighlight[]
}> {
  const rows = await mentionRows(db, brandId, since, { isSelf: false, key })
  const [summary] = summarizeMentions(rows, totalAnswers)
  const highlights = await brandHighlights(db, brandId, since, {
    isSelf: false,
    key,
  })
  return { summary: summary ?? null, highlights }
}

/** Sentiment the platforms attach to the tracked brand, from the extractor's own-brand rows. */
export async function selfSentiment(
  db: Database,
  brandId: number,
  since: Date
): Promise<SentimentCounts & { recommended: number; answers: number }> {
  const rows = await mentionRows(db, brandId, since, { isSelf: true })
  const [summary] = summarizeMentions(rows, 0)
  return {
    positive: summary?.sentiment.positive ?? 0,
    neutral: summary?.sentiment.neutral ?? 0,
    negative: summary?.sentiment.negative ?? 0,
    recommended: summary?.recommended ?? 0,
    answers: summary?.answers ?? 0,
  }
}
