import type { Metadata } from 'next'
import {
  Muted,
  PageHeader,
  PeriodSelect,
  Section,
  TABLE_INSET,
  TextLink,
} from '@/components/blocks'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getDb } from '@/lib/db'
import { fmtDate, fmtPct, fmtPosition } from '@/lib/format'
import { platformLabel } from '@/lib/platforms'
import { scoredAnswersSince } from '@/lib/queries/answers'
import { getBrand } from '@/lib/queries/brand'
import { brandHighlights, competitorSummaries } from '@/lib/queries/competitors'
import { parsePeriod, periodRange } from '@/lib/queries/period'

export const metadata: Metadata = { title: 'Competitors' }

export default async function CompetitorsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>
}) {
  const { period: periodParam } = await searchParams
  const period = parsePeriod(periodParam)
  const range = periodRange(period)
  const db = await getDb()
  const brand = (await getBrand(db))!
  const answers = await scoredAnswersSince(db, brand.id, range.since)
  const competitors = await competitorSummaries(
    db,
    brand.id,
    range.since,
    answers.length
  )
  const ownHighlights = await brandHighlights(
    db,
    brand.id,
    range.since,
    { isSelf: true },
    12
  )

  return (
    <>
      <PageHeader
        title="Competitors"
        description="Every brand the platforms named as an alternative, with what they said about it."
        actions={<PeriodSelect current={period} basePath="/competitors" />}
      />

      <Section
        title={`Brands named in ${answers.length} answers`}
        description="Share is the proportion of answers naming the brand."
        flush
      >
        {competitors.length === 0 ? (
          <Muted className="px-6 py-6 text-center">
            No competitors in this period.
          </Muted>
        ) : (
          <Table className={TABLE_INSET}>
            <TableHeader>
              <TableRow>
                <TableHead>Brand</TableHead>
                <TableHead className="text-right">Answers</TableHead>
                <TableHead className="text-right">Share</TableHead>
                <TableHead className="text-right">Position</TableHead>
                <TableHead className="text-right">Recommended</TableHead>
                <TableHead>Sentiment</TableHead>
                <TableHead>Platforms</TableHead>
                <TableHead>Last seen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {competitors.map((c) => (
                <TableRow key={c.key}>
                  <TableCell>
                    <TextLink
                      href={`/competitors/${encodeURIComponent(
                        c.key
                      )}?period=${period}`}
                      className="font-medium"
                    >
                      {c.name}
                    </TextLink>
                    {c.website ? (
                      <p className="text-xs text-muted-foreground">
                        {c.website}
                      </p>
                    ) : null}
                  </TableCell>
                  <TableCell className="num text-right">{c.answers}</TableCell>
                  <TableCell className="num text-right">
                    {fmtPct(c.share)}
                  </TableCell>
                  <TableCell className="num text-right">
                    {fmtPosition(c.avgPosition)}
                  </TableCell>
                  <TableCell className="num text-right">
                    {c.recommended}
                  </TableCell>
                  <TableCell className="num text-muted-foreground">
                    {c.sentiment.positive} pos · {c.sentiment.neutral} neu ·{' '}
                    {c.sentiment.negative} neg
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {Object.entries(c.platforms)
                      .map(([p, n]) => `${platformLabel(p)} ${n}`)
                      .join(' · ')}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {fmtDate(c.lastSeenAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Section>

      <Section
        className="mt-6"
        title={`What the platforms say about ${brand.name}`}
        description="Statements extracted from answers that name your brand."
        flush
      >
        {ownHighlights.length === 0 ? (
          <Muted className="px-6">Nothing yet in this period.</Muted>
        ) : (
          <ul className="divide-y">
            {ownHighlights.map((h) => (
              <li key={`${h.answerId}`} className="px-6 py-3 text-sm">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>{platformLabel(h.platform)}</span>
                  <span>·</span>
                  <span>{fmtDate(h.completedAt)}</span>
                  <Badge variant="outline">{h.sentiment}</Badge>
                  {h.recommended ? (
                    <Badge variant="outline">recommended</Badge>
                  ) : null}
                  <TextLink href={`/answers/${h.answerId}`} muted>
                    {h.questionText}
                  </TextLink>
                </div>
                <ul className="mt-1 space-y-0.5">
                  {h.highlights.map((text) => (
                    <li key={text}>{text}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  )
}
