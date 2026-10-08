import { and, desc, eq, gte, sql } from 'drizzle-orm'
import type { Database } from '@/lib/db'
import {
  answers,
  brandMentions,
  questions,
  type Answer,
  type BrandMention,
  type Question,
} from '@/lib/db/schema'
import type { ScoredAnswer } from '@/lib/analysis/scoring'

/** Completed answers of a brand since a date, without the answer text. */
export async function scoredAnswersSince(
  db: Database,
  brandId: number,
  since: Date
): Promise<ScoredAnswer[]> {
  const rows = await db
    .select({
      id: answers.id,
      platform: answers.platform,
      questionId: answers.questionId,
      brandMentioned: answers.brandMentioned,
      brandCited: answers.brandCited,
      brandPosition: answers.brandPosition,
      completedAt: answers.completedAt,
      sources: answers.sources,
    })
    .from(answers)
    .where(
      and(
        eq(answers.brandId, brandId),
        eq(answers.status, 'done'),
        gte(answers.completedAt, since)
      )
    )
  return rows.map((row) => ({
    ...row,
    completedAt: row.completedAt ?? new Date(0),
  }))
}

export interface AnswerFilters {
  since: Date
  platform?: string
  questionId?: number
  mentioned?: 'yes' | 'no'
  page: number
  pageSize: number
}

export interface AnswerListRow {
  id: number
  platform: string
  questionId: number
  questionText: string
  status: Answer['status']
  brandMentioned: boolean
  brandCited: boolean
  brandPosition: number | null
  brandsNamed: number
  sourcesCount: number
  completedAt: Date | null
  error: string | null
}

export async function listAnswers(
  db: Database,
  brandId: number,
  filters: AnswerFilters
): Promise<{ rows: AnswerListRow[]; total: number }> {
  const conditions = [
    eq(answers.brandId, brandId),
    gte(answers.createdAt, filters.since),
  ]
  if (filters.platform) conditions.push(eq(answers.platform, filters.platform))
  if (filters.questionId)
    conditions.push(eq(answers.questionId, filters.questionId))
  if (filters.mentioned === 'yes')
    conditions.push(eq(answers.brandMentioned, true))
  if (filters.mentioned === 'no')
    conditions.push(
      and(eq(answers.brandMentioned, false), eq(answers.status, 'done'))!
    )
  const where = and(...conditions)

  const [{ total }] = await db
    .select({ total: sql<number>`count(*)`.mapWith(Number) })
    .from(answers)
    .where(where)

  const rows = await db
    .select({
      id: answers.id,
      platform: answers.platform,
      questionId: answers.questionId,
      questionText: questions.text,
      status: answers.status,
      brandMentioned: answers.brandMentioned,
      brandCited: answers.brandCited,
      brandPosition: answers.brandPosition,
      brandsNamed: answers.brandsNamed,
      sourcesCount: sql<number>`jsonb_array_length(${answers.sources})`.mapWith(
        Number
      ),
      completedAt: answers.completedAt,
      error: answers.error,
    })
    .from(answers)
    .innerJoin(questions, eq(questions.id, answers.questionId))
    .where(where)
    .orderBy(desc(answers.id))
    .limit(filters.pageSize)
    .offset((filters.page - 1) * filters.pageSize)

  return { rows, total }
}

export interface AnswerDetail {
  answer: Answer
  question: Question
  mentions: BrandMention[]
}

export async function getAnswer(
  db: Database,
  brandId: number,
  id: number
): Promise<AnswerDetail | null> {
  const [row] = await db
    .select({ answer: answers, question: questions })
    .from(answers)
    .innerJoin(questions, eq(questions.id, answers.questionId))
    .where(and(eq(answers.id, id), eq(answers.brandId, brandId)))
    .limit(1)
  if (!row) return null
  const mentions = await db
    .select()
    .from(brandMentions)
    .where(eq(brandMentions.answerId, id))
    .orderBy(sql`${brandMentions.position} nulls last`, brandMentions.id)
  return { answer: row.answer, question: row.question, mentions }
}

export interface ExportRow {
  completedAt: Date | null
  question: string
  platform: string
  modelId: string | null
  brandMentioned: boolean
  brandCited: boolean
  brandPosition: number | null
  brandsNamed: number
  sources: Array<{ url: string }>
  text: string | null
}

export async function answersForExport(
  db: Database,
  brandId: number,
  since: Date
): Promise<ExportRow[]> {
  return db
    .select({
      completedAt: answers.completedAt,
      question: questions.text,
      platform: answers.platform,
      modelId: answers.modelId,
      brandMentioned: answers.brandMentioned,
      brandCited: answers.brandCited,
      brandPosition: answers.brandPosition,
      brandsNamed: answers.brandsNamed,
      sources: answers.sources,
      text: answers.text,
    })
    .from(answers)
    .innerJoin(questions, eq(questions.id, answers.questionId))
    .where(
      and(
        eq(answers.brandId, brandId),
        eq(answers.status, 'done'),
        gte(answers.completedAt, since)
      )
    )
    .orderBy(desc(answers.completedAt))
}
