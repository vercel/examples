import { Download } from 'lucide-react'
import Link from 'next/link'
import { startRun } from '@/app/actions/runs'
import { BarRows } from '@/components/bar-rows'
import {
  EmptyState,
  Muted,
  Notice,
  PageHeader,
  PeriodSelect,
  Section,
  Stat,
  TABLE_INSET,
  TextLink,
} from '@/components/blocks'
import { TrendChart } from '@/components/trend-chart'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getDb } from '@/lib/db'
import {
  fmtDateTime,
  fmtDelta,
  fmtPct,
  fmtPosition,
  truncate,
} from '@/lib/format'
import { marketLabel } from '@/lib/markets'
import { platformLabel } from '@/lib/platforms'
import { getBrand } from '@/lib/queries/brand'
import { getOverview } from '@/lib/queries/overview'
import { parsePeriod } from '@/lib/queries/period'

export default async function OverviewPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>
}) {
  const { period: periodParam } = await searchParams
  const period = parsePeriod(periodParam)
  const db = await getDb()
  const brand = (await getBrand(db))!
  const data = await getOverview(db, brand, period)
  const hasQuestions = data.questions.length > 0

  if (data.runs.length === 0) {
    return (
      <>
        <PageHeader
          title="Overview"
          description={`${brand.name} · ${marketLabel(brand)}`}
        />
        <Card>
          <EmptyState
            title={
              hasQuestions
                ? 'Run your first check'
                : 'Add the questions your customers ask'
            }
            description={
              hasQuestions
                ? `Every active question is asked on ${
                    brand.platforms.length
                  } platform${
                    brand.platforms.length === 1 ? '' : 's'
                  }. The first results appear within a minute.`
                : 'The tracker asks each question on the AI platforms you selected and records who gets mentioned, cited and recommended.'
            }
            action={
              hasQuestions ? (
                <form action={startRun}>
                  <Button type="submit">Run now</Button>
                </form>
              ) : (
                <Button asChild>
                  <Link href="/questions">Add questions</Link>
                </Button>
              )
            }
          />
        </Card>
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Overview"
        description={`${brand.name} · ${marketLabel(brand)}`}
        actions={
          <>
            <PeriodSelect current={period} basePath="/" />
            <Button asChild variant="outline" size="sm">
              <a href={`/api/export/answers?period=${period}`}>
                <Download data-icon="inline-start" />
                CSV
              </a>
            </Button>
          </>
        }
      />

      {data.answers === 0 ? (
        <Notice className="mb-6">
          No completed answers in the last {data.days} days. Scores appear after
          the next check.
        </Notice>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Visibility score"
          value={fmtPct(data.score)}
          delta={fmtDelta(data.scoreDelta)}
          hint={`${data.answers} answers`}
        />
        <Stat
          label="Website cited"
          value={fmtPct(data.citationRate)}
          delta={fmtDelta(data.citationDelta)}
          hint="answers linking your site"
        />
        <Stat
          label="Share of voice"
          value={fmtPct(data.shareOfVoice)}
          hint={
            data.competitors.length > 0
              ? `vs ${data.competitors.length} competitors`
              : 'no competitors yet'
          }
        />
        <Stat
          label="Average position"
          value={fmtPosition(data.avgPosition)}
          hint="among brands named, when mentioned"
        />
      </div>

      <Section
        className="mt-6"
        title="Visibility score by day"
        description="Share of answers that mention the brand."
      >
        <TrendChart points={data.trend} />
      </Section>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Section title="Platforms" description="Visibility score per platform.">
          {data.platforms.length === 0 ? (
            <Muted>No answers yet.</Muted>
          ) : (
            <BarRows
              rows={data.platforms.map((p) => ({
                key: p.platform,
                label: platformLabel(p.platform),
                value: p.score,
                detail: `${p.mentioned}/${p.answers}`,
              }))}
              formatValue={(v) => fmtPct(v)}
            />
          )}
        </Section>

        <Section
          title="What AI says about you"
          description="Sentiment of the answers that name the brand."
          action={
            <TextLink href="/answers?mentioned=yes" muted>
              See answers
            </TextLink>
          }
        >
          {data.selfSentiment.answers === 0 ? (
            <Muted>The brand has not been named in this period.</Muted>
          ) : (
            <BarRows
              rows={[
                {
                  key: 'positive',
                  label: 'Positive',
                  value: pct(
                    data.selfSentiment.positive,
                    data.selfSentiment.answers
                  ),
                  detail: String(data.selfSentiment.positive),
                },
                {
                  key: 'neutral',
                  label: 'Neutral',
                  value: pct(
                    data.selfSentiment.neutral,
                    data.selfSentiment.answers
                  ),
                  detail: String(data.selfSentiment.neutral),
                },
                {
                  key: 'negative',
                  label: 'Negative',
                  value: pct(
                    data.selfSentiment.negative,
                    data.selfSentiment.answers
                  ),
                  detail: String(data.selfSentiment.negative),
                },
                {
                  key: 'recommended',
                  label: 'Recommended',
                  value: pct(
                    data.selfSentiment.recommended,
                    data.selfSentiment.answers
                  ),
                  detail: String(data.selfSentiment.recommended),
                },
              ]}
              formatValue={(v) => fmtPct(v)}
            />
          )}
        </Section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Section
          title="Competitors"
          description="Brands the platforms name instead of, or next to, yours."
          action={
            <TextLink href={`/competitors?period=${period}`} muted>
              All competitors
            </TextLink>
          }
          flush
        >
          {data.competitors.length === 0 ? (
            <Muted className="px-6">No competitors extracted yet.</Muted>
          ) : (
            <Table className={TABLE_INSET}>
              <TableHeader>
                <TableRow>
                  <TableHead>Brand</TableHead>
                  <TableHead className="text-right">Answers</TableHead>
                  <TableHead className="text-right">Share</TableHead>
                  <TableHead className="text-right">Position</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.competitors.map((c) => (
                  <TableRow key={c.key}>
                    <TableCell>
                      <TextLink
                        href={`/competitors/${encodeURIComponent(
                          c.key
                        )}?period=${period}`}
                      >
                        {c.name}
                      </TextLink>
                      {c.website ? (
                        <span className="ml-2 text-xs text-muted-foreground">
                          {c.website}
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell className="num text-right">
                      {c.answers}
                    </TableCell>
                    <TableCell className="num text-right">
                      {fmtPct(c.share)}
                    </TableCell>
                    <TableCell className="num text-right">
                      {fmtPosition(c.avgPosition)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Section>

        <Section
          title="Cited sources"
          description="Domains the answers cite most."
          flush
        >
          {data.domains.length === 0 ? (
            <Muted className="px-6">No citations yet.</Muted>
          ) : (
            <Table className={TABLE_INSET}>
              <TableHeader>
                <TableRow>
                  <TableHead>Domain</TableHead>
                  <TableHead className="text-right">Answers</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.domains.map((d) => (
                  <TableRow key={d.domain}>
                    <TableCell>
                      {d.domain}
                      {d.isOwn ? <Badge className="ml-2">you</Badge> : null}
                    </TableCell>
                    <TableCell className="num text-right">
                      {d.answers}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
        <Section
          title="Questions"
          description="Visibility score per question."
          action={
            <TextLink href="/questions" muted>
              Manage
            </TextLink>
          }
          flush
        >
          <Table className={TABLE_INSET}>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead className="text-right">Score</TableHead>
                <TableHead className="text-right">Cited</TableHead>
                <TableHead className="text-right">Answers</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.questions.slice(0, 12).map((q) => (
                <TableRow key={q.questionId}>
                  <TableCell className="whitespace-normal">
                    <TextLink
                      href={`/answers?questionId=${q.questionId}&period=${period}`}
                    >
                      {truncate(q.text, 90)}
                    </TextLink>
                    {!q.isActive ? (
                      <Badge variant="secondary" className="ml-2">
                        paused
                      </Badge>
                    ) : null}
                  </TableCell>
                  <TableCell className="num text-right">
                    {fmtPct(q.score)}
                  </TableCell>
                  <TableCell className="num text-right">
                    {fmtPct(q.citationRate)}
                  </TableCell>
                  <TableCell className="num text-right">{q.answers}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Section>

        <Section title="Latest checks" flush>
          <ul className="divide-y">
            {data.runs.map((run) => (
              <li
                key={run.id}
                className="flex items-center justify-between gap-3 px-6 py-3 text-sm"
              >
                <div>
                  <TextLink href={`/runs/${run.id}`} className="font-medium">
                    {run.trigger === 'scheduled' ? 'Scheduled' : 'Manual'} check
                  </TextLink>
                  <p className="text-xs text-muted-foreground">
                    {fmtDateTime(run.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      run.status === 'completed' ? 'outline' : 'secondary'
                    }
                  >
                    {run.status}
                  </Badge>
                  <p className="num mt-1 text-xs text-muted-foreground">
                    {run.doneItems}/{run.totalItems}
                    {run.failedItems > 0 ? ` · ${run.failedItems} failed` : ''}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </>
  )
}

function pct(part: number, whole: number): number | null {
  return whole > 0 ? Math.round((part / whole) * 1000) / 10 : null
}
