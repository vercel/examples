import type { Database } from '@/lib/db'
import type { Brand, Run } from '@/lib/db/schema'
import {
  averagePosition,
  citationRate,
  delta,
  platformBreakdown,
  questionBreakdown,
  shareOfVoice,
  topDomains,
  trendByDay,
  visibilityScore,
  type DomainStat,
  type PlatformStat,
  type QuestionStat,
  type ScoredAnswer,
  type TrendPoint,
} from '@/lib/analysis/scoring'
import { normalizePlatformList } from '@/lib/platforms'
import { scoredAnswersSince } from './answers'
import {
  competitorSummaries,
  selfSentiment,
  type CompetitorSummary,
  type SentimentCounts,
} from './competitors'
import { periodRange, type PeriodKey } from './period'
import { listRuns } from './runs'
import { eq } from 'drizzle-orm'
import { questions } from '@/lib/db/schema'

export interface OverviewData {
  period: PeriodKey
  days: number
  answers: number
  score: number | null
  scoreDelta: number | null
  citationRate: number | null
  citationDelta: number | null
  shareOfVoice: number | null
  avgPosition: number | null
  selfSentiment: SentimentCounts & { recommended: number; answers: number }
  platforms: PlatformStat[]
  trend: TrendPoint[]
  questions: Array<
    QuestionStat & { text: string; cadence: string; isActive: boolean }
  >
  competitors: CompetitorSummary[]
  domains: DomainStat[]
  runs: Run[]
}

export async function getOverview(
  db: Database,
  brand: Brand,
  period: PeriodKey,
  now: Date = new Date()
): Promise<OverviewData> {
  const range = periodRange(period, now)
  const all = await scoredAnswersSince(db, brand.id, range.previousSince)
  const current: ScoredAnswer[] = []
  const previous: ScoredAnswer[] = []
  for (const row of all)
    (row.completedAt >= range.since ? current : previous).push(row)

  const competitors = await competitorSummaries(
    db,
    brand.id,
    range.since,
    current.length
  )
  const questionRows = await db
    .select({
      id: questions.id,
      text: questions.text,
      cadence: questions.cadence,
      isActive: questions.isActive,
    })
    .from(questions)
    .where(eq(questions.brandId, brand.id))
    .orderBy(questions.id)
  const statsByQuestion = new Map(
    questionBreakdown(current).map((stat) => [stat.questionId, stat])
  )

  const ownMentioned = current.filter((r) => r.brandMentioned).length
  const currentScore = visibilityScore(current)
  const currentCitation = citationRate(current)

  return {
    period,
    days: range.days,
    answers: current.length,
    score: currentScore,
    scoreDelta: delta(currentScore, visibilityScore(previous)),
    citationRate: currentCitation,
    citationDelta: delta(currentCitation, citationRate(previous)),
    shareOfVoice: shareOfVoice(
      ownMentioned,
      competitors.map((c) => c.answers)
    ),
    avgPosition: averagePosition(current),
    selfSentiment: await selfSentiment(db, brand.id, range.since),
    platforms: platformBreakdown(
      current,
      normalizePlatformList(brand.platforms)
    ),
    trend: trendByDay(current, range.days, now),
    questions: questionRows.map((q) => ({
      ...(statsByQuestion.get(q.id) ?? {
        questionId: q.id,
        answers: 0,
        mentioned: 0,
        cited: 0,
        score: null,
        citationRate: null,
        avgPosition: null,
      }),
      text: q.text,
      cadence: q.cadence,
      isActive: q.isActive,
    })),
    competitors: competitors.slice(0, 8),
    domains: topDomains(current, brand.domain, 10),
    runs: await listRuns(db, brand.id, 5),
  }
}
