import { hostOf, hostMatchesDomain, normalizeDomain } from './mentions'

/** The answer fields the report metrics need. Never the answer text. */
export interface ScoredAnswer {
  id: number
  platform: string
  questionId: number
  brandMentioned: boolean
  brandCited: boolean
  brandPosition: number | null
  completedAt: Date
  sources: ReadonlyArray<{ url: string }>
}

export function percentage(part: number, whole: number): number | null {
  if (whole <= 0) return null
  return Math.round((part / whole) * 1000) / 10
}

/** Share of answers that mention the brand. */
export function visibilityScore(
  rows: ReadonlyArray<ScoredAnswer>
): number | null {
  return percentage(rows.filter((r) => r.brandMentioned).length, rows.length)
}

/** Share of answers that cite the tracked website. */
export function citationRate(rows: ReadonlyArray<ScoredAnswer>): number | null {
  return percentage(rows.filter((r) => r.brandCited).length, rows.length)
}

/** Mean rank of the brand among the brands named, over answers that mention it. */
export function averagePosition(
  rows: ReadonlyArray<ScoredAnswer>
): number | null {
  const positions = rows
    .map((r) => r.brandPosition)
    .filter((p): p is number => p !== null)
  if (positions.length === 0) return null
  return (
    Math.round((positions.reduce((a, b) => a + b, 0) / positions.length) * 10) /
    10
  )
}

export interface GroupStat {
  answers: number
  mentioned: number
  cited: number
  score: number | null
  citationRate: number | null
  avgPosition: number | null
}

export function groupStat(rows: ReadonlyArray<ScoredAnswer>): GroupStat {
  return {
    answers: rows.length,
    mentioned: rows.filter((r) => r.brandMentioned).length,
    cited: rows.filter((r) => r.brandCited).length,
    score: visibilityScore(rows),
    citationRate: citationRate(rows),
    avgPosition: averagePosition(rows),
  }
}

export function groupBy<K>(
  rows: ReadonlyArray<ScoredAnswer>,
  keyOf: (row: ScoredAnswer) => K
): Map<K, ScoredAnswer[]> {
  const groups = new Map<K, ScoredAnswer[]>()
  for (const row of rows) {
    const key = keyOf(row)
    const list = groups.get(key)
    if (list) list.push(row)
    else groups.set(key, [row])
  }
  return groups
}

export type PlatformStat = GroupStat & { platform: string }

export function platformBreakdown(
  rows: ReadonlyArray<ScoredAnswer>,
  order: ReadonlyArray<string>
): PlatformStat[] {
  const groups = groupBy(rows, (r) => r.platform)
  const platforms = [
    ...order.filter((p) => groups.has(p)),
    ...Array.from(groups.keys()).filter((p) => !order.includes(p)),
  ]
  return platforms.map((platform) => ({
    platform,
    ...groupStat(groups.get(platform) ?? []),
  }))
}

export type QuestionStat = GroupStat & { questionId: number }

export function questionBreakdown(
  rows: ReadonlyArray<ScoredAnswer>
): QuestionStat[] {
  return Array.from(groupBy(rows, (r) => r.questionId).entries()).map(
    ([questionId, list]) => ({
      questionId,
      ...groupStat(list),
    })
  )
}

export interface TrendPoint {
  date: string
  score: number | null
  answers: number
}

export function dayKey(date: Date): string {
  return date.toISOString().slice(0, 10)
}

/** Daily visibility score over the last `days` days, oldest first; days without answers carry null. */
export function trendByDay(
  rows: ReadonlyArray<ScoredAnswer>,
  days: number,
  now: Date = new Date()
): TrendPoint[] {
  const groups = groupBy(rows, (r) => dayKey(r.completedAt))
  const points: TrendPoint[] = []
  const end = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  )
  for (let i = days - 1; i >= 0; i -= 1) {
    const day = new Date(end.getTime() - i * 86_400_000)
    const key = dayKey(day)
    const list = groups.get(key) ?? []
    points.push({
      date: key,
      score: visibilityScore(list),
      answers: list.length,
    })
  }
  return points
}

export interface DomainStat {
  domain: string
  answers: number
  isOwn: boolean
}

/** Domains cited by the most answers (each answer counts a domain once). */
export function topDomains(
  rows: ReadonlyArray<ScoredAnswer>,
  ownDomainInput: string,
  limit = 10
): DomainStat[] {
  const ownDomain = normalizeDomain(ownDomainInput)
  const counts = new Map<string, number>()
  for (const row of rows) {
    const hosts = new Set<string>()
    for (const source of row.sources) {
      const host = hostOf(source.url)
      if (host) hosts.add(host)
    }
    for (const host of hosts) counts.set(host, (counts.get(host) ?? 0) + 1)
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([domain, answers]) => ({
      domain,
      answers,
      isOwn: hostMatchesDomain(domain, ownDomain),
    }))
}

/** Brand's share of all brand appearances: own answers over own plus every competitor's answers. */
export function shareOfVoice(
  ownAnswers: number,
  competitorAnswers: ReadonlyArray<number>
): number | null {
  const total = ownAnswers + competitorAnswers.reduce((a, b) => a + b, 0)
  return percentage(ownAnswers, total)
}

/** Change between two percentages in points, rounded to one decimal. */
export function delta(
  current: number | null,
  previous: number | null
): number | null {
  if (current === null || previous === null) return null
  return Math.round((current - previous) * 10) / 10
}
