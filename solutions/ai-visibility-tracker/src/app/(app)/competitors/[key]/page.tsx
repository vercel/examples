import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  Muted,
  PageHeader,
  PeriodSelect,
  Section,
  Stat,
  TextLink,
} from '@/components/blocks'
import { Badge } from '@/components/ui/badge'
import { getDb } from '@/lib/db'
import { fmtDate, fmtPct, fmtPosition } from '@/lib/format'
import { platformLabel } from '@/lib/platforms'
import { scoredAnswersSince } from '@/lib/queries/answers'
import { getBrand } from '@/lib/queries/brand'
import { competitorDetail } from '@/lib/queries/competitors'
import { parsePeriod, periodRange } from '@/lib/queries/period'

export const metadata: Metadata = { title: 'Competitor' }

export default async function CompetitorPage({
  params,
  searchParams,
}: {
  params: Promise<{ key: string }>
  searchParams: Promise<{ period?: string }>
}) {
  const { key: rawKey } = await params
  const key = decodeURIComponent(rawKey)
  const { period: periodParam } = await searchParams
  const period = parsePeriod(periodParam)
  const range = periodRange(period)
  const db = await getDb()
  const brand = (await getBrand(db))!
  const answers = await scoredAnswersSince(db, brand.id, range.since)
  const { summary, highlights } = await competitorDetail(
    db,
    brand.id,
    key,
    range.since,
    answers.length
  )
  if (!summary) notFound()

  return (
    <>
      <PageHeader
        title={summary.name}
        description={summary.website ?? 'Website unknown'}
        actions={
          <>
            <PeriodSelect
              current={period}
              basePath={`/competitors/${encodeURIComponent(key)}`}
            />
            <TextLink href={`/competitors?period=${period}`} muted>
              All competitors
            </TextLink>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Answers naming it"
          value={String(summary.answers)}
          hint={`${fmtPct(summary.share)} of ${answers.length} answers`}
        />
        <Stat
          label="Average position"
          value={fmtPosition(summary.avgPosition)}
          hint="among brands named"
        />
        <Stat
          label="Recommended"
          value={String(summary.recommended)}
          hint="answers ranking it as a top pick"
        />
        <Stat
          label="Sentiment"
          value={`${summary.sentiment.positive} / ${summary.sentiment.neutral} / ${summary.sentiment.negative}`}
          hint="positive / neutral / negative"
        />
      </div>

      <Section className="mt-6" title="By platform">
        <ul className="flex flex-wrap gap-2">
          {Object.entries(summary.platforms).map(([platform, count]) => (
            <li key={platform}>
              <Badge variant="outline">
                {platformLabel(platform)} · {count}
              </Badge>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        className="mt-6"
        title="What the platforms said"
        description="Newest first. Each entry links to the full answer."
        flush
      >
        <ul className="divide-y">
          {highlights.map((h) => (
            <li
              key={`${h.answerId}-${h.platform}`}
              className="px-6 py-3 text-sm"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>{platformLabel(h.platform)}</span>
                <span>·</span>
                <span>{fmtDate(h.completedAt)}</span>
                {h.position ? <span className="num">#{h.position}</span> : null}
                <Badge variant="outline">{h.sentiment}</Badge>
                {h.recommended ? (
                  <Badge variant="outline">recommended</Badge>
                ) : null}
                <TextLink href={`/answers/${h.answerId}`} muted>
                  {h.questionText}
                </TextLink>
              </div>
              {h.highlights.length > 0 ? (
                <ul className="mt-1 space-y-0.5">
                  {h.highlights.map((text) => (
                    <li key={text}>{text}</li>
                  ))}
                </ul>
              ) : (
                <Muted className="mt-1">Named without details.</Muted>
              )}
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}
