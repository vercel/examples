import type { Metadata } from 'next'
import { asc, eq } from 'drizzle-orm'
import { Download } from 'lucide-react'
import Link from 'next/link'
import { Muted, PageHeader, TABLE_INSET, TextLink } from '@/components/blocks'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getDb } from '@/lib/db'
import { questions } from '@/lib/db/schema'
import { fmtDateTime, fmtPosition, truncate } from '@/lib/format'
import { PLATFORM_IDS, PLATFORMS, platformLabel } from '@/lib/platforms'
import { listAnswers } from '@/lib/queries/answers'
import { getBrand } from '@/lib/queries/brand'
import { PERIODS, parsePeriod, periodRange } from '@/lib/queries/period'

export const metadata: Metadata = { title: 'Answers' }

const PAGE_SIZE = 50

type Search = {
  period?: string
  platform?: string
  questionId?: string
  mentioned?: string
  page?: string
}

export default async function AnswersPage({
  searchParams,
}: {
  searchParams: Promise<Search>
}) {
  const params = await searchParams
  const period = parsePeriod(params.period)
  const platform = PLATFORM_IDS.includes(
    params.platform as (typeof PLATFORM_IDS)[number]
  )
    ? params.platform
    : undefined
  const questionId =
    Number(params.questionId) > 0 ? Number(params.questionId) : undefined
  const mentioned =
    params.mentioned === 'yes' || params.mentioned === 'no'
      ? params.mentioned
      : undefined
  const page = Math.max(1, Number(params.page) || 1)

  const db = await getDb()
  const brand = (await getBrand(db))!
  const questionRows = await db
    .select({ id: questions.id, text: questions.text })
    .from(questions)
    .where(eq(questions.brandId, brand.id))
    .orderBy(asc(questions.id))
  const { rows, total } = await listAnswers(db, brand.id, {
    since: periodRange(period).since,
    platform,
    questionId,
    mentioned,
    page,
    pageSize: PAGE_SIZE,
  })
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const pageLink = (n: number) => {
    const search = new URLSearchParams()
    search.set('period', period)
    if (platform) search.set('platform', platform)
    if (questionId) search.set('questionId', String(questionId))
    if (mentioned) search.set('mentioned', mentioned)
    search.set('page', String(n))
    return `/answers?${search.toString()}`
  }

  return (
    <>
      <PageHeader
        title="Answers"
        description="Every stored answer, with the brands it names and the sources it cites."
        actions={
          <Button asChild variant="outline" size="sm">
            <a href={`/api/export/answers?period=${period}`}>
              <Download data-icon="inline-start" />
              CSV
            </a>
          </Button>
        }
      />

      <form method="get" className="mb-4 flex flex-wrap items-end gap-3">
        <div className="grid w-32 gap-1.5">
          <Label htmlFor="period">Period</Label>
          <Select name="period" defaultValue={period}>
            <SelectTrigger id="period" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PERIODS.map((p) => (
                <SelectItem key={p.key} value={p.key}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid w-40 gap-1.5">
          <Label htmlFor="platform">Platform</Label>
          <Select name="platform" defaultValue={platform ?? 'all'}>
            <SelectTrigger id="platform" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All platforms</SelectItem>
              {PLATFORM_IDS.map((id) => (
                <SelectItem key={id} value={id}>
                  {PLATFORMS[id].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid w-72 gap-1.5">
          <Label htmlFor="questionId">Question</Label>
          <Select
            name="questionId"
            defaultValue={questionId ? String(questionId) : 'all'}
          >
            <SelectTrigger id="questionId" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All questions</SelectItem>
              {questionRows.map((q) => (
                <SelectItem key={q.id} value={String(q.id)}>
                  {truncate(q.text, 60)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid w-40 gap-1.5">
          <Label htmlFor="mentioned">Brand</Label>
          <Select name="mentioned" defaultValue={mentioned ?? 'any'}>
            <SelectTrigger id="mentioned" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="yes">Mentioned</SelectItem>
              <SelectItem value="no">Not mentioned</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" variant="outline">
          Filter
        </Button>
      </form>

      <Card className="py-0">
        {rows.length === 0 ? (
          <Muted className="px-6 py-8 text-center">
            No answers match these filters.
          </Muted>
        ) : (
          <Table className={TABLE_INSET}>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead className="text-right">Position</TableHead>
                <TableHead className="text-right">Brands</TableHead>
                <TableHead className="text-right">Sources</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <TextLink href={`/answers/${row.id}`}>
                      {fmtDateTime(row.completedAt ?? null)}
                    </TextLink>
                  </TableCell>
                  <TableCell className="whitespace-normal">
                    {truncate(row.questionText, 80)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {platformLabel(row.platform)}
                  </TableCell>
                  <TableCell>
                    {row.status === 'done' ? (
                      <span className="flex flex-wrap gap-1">
                        <Badge
                          variant={row.brandMentioned ? 'default' : 'outline'}
                        >
                          {row.brandMentioned ? 'Mentioned' : 'Not mentioned'}
                        </Badge>
                        {row.brandCited ? (
                          <Badge variant="outline">Cited</Badge>
                        ) : null}
                      </span>
                    ) : (
                      <Badge variant="secondary" className="capitalize">
                        {row.status}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="num text-right">
                    {fmtPosition(row.brandPosition)}
                  </TableCell>
                  <TableCell className="num text-right">
                    {row.brandsNamed}
                  </TableCell>
                  <TableCell className="num text-right">
                    {row.sourcesCount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {pages > 1 ? (
          <div className="flex items-center justify-between border-t px-6 py-3 text-sm text-muted-foreground">
            <span className="num">
              Page {page} of {pages} · {total} answers
            </span>
            <span className="flex gap-3">
              {page > 1 ? (
                <Link
                  href={pageLink(page - 1)}
                  className="underline-offset-4 hover:text-foreground hover:underline"
                >
                  Previous
                </Link>
              ) : null}
              {page < pages ? (
                <Link
                  href={pageLink(page + 1)}
                  className="underline-offset-4 hover:text-foreground hover:underline"
                >
                  Next
                </Link>
              ) : null}
            </span>
          </div>
        ) : null}
      </Card>
    </>
  )
}
