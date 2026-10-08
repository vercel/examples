import type { Metadata } from 'next'
import { asc, eq } from 'drizzle-orm'
import { updateQuestion } from '@/app/actions/questions'
import { startRun } from '@/app/actions/runs'
import {
  Muted,
  Notice,
  PageHeader,
  Section,
  TABLE_INSET,
} from '@/components/blocks'
import { QuestionForm } from '@/components/question-form'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { questionBreakdown } from '@/lib/analysis/scoring'
import { getDb } from '@/lib/db'
import { questions } from '@/lib/db/schema'
import { fmtPct, fmtRelative } from '@/lib/format'
import { scoredAnswersSince } from '@/lib/queries/answers'
import { getBrand } from '@/lib/queries/brand'
import { periodRange } from '@/lib/queries/period'
import { listRuns } from '@/lib/queries/runs'
import { isAuthenticated } from '@/lib/auth/session'
import { DEMO_READ_ONLY_MESSAGE, isDemoMode } from '@/lib/demo'

export const metadata: Metadata = { title: 'Questions' }

function RowAction({
  id,
  intent,
  label,
  cadence,
}: {
  id: number
  intent: string
  label: string
  cadence?: string
}) {
  return (
    <form action={updateQuestion} className="inline">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="intent" value={intent} />
      {cadence ? <input type="hidden" name="cadence" value={cadence} /> : null}
      <Button
        type="submit"
        variant="link"
        size="xs"
        className="h-auto px-0 text-muted-foreground hover:text-foreground"
      >
        {label}
      </Button>
    </form>
  )
}

export default async function QuestionsPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>
}) {
  const { welcome } = await searchParams
  const db = await getDb()
  const brand = (await getBrand(db))!
  const rows = await db
    .select()
    .from(questions)
    .where(eq(questions.brandId, brand.id))
    .orderBy(asc(questions.id))
  const stats = new Map(
    questionBreakdown(
      await scoredAnswersSince(db, brand.id, periodRange('30d').since)
    ).map((s) => [s.questionId, s])
  )
  const runs = await listRuns(db, brand.id, 1)
  const readOnly = isDemoMode() && !(await isAuthenticated())

  return (
    <>
      <PageHeader
        title="Questions"
        description="Each active question is asked on every selected platform. Daily questions run every day, weekly ones once a week."
        actions={
          rows.length > 0 && runs.length === 0 ? (
            <form action={startRun}>
              <Button type="submit">Run first check</Button>
            </form>
          ) : null
        }
      />

      {readOnly ? (
        <Notice className="mb-6">{DEMO_READ_ONLY_MESSAGE}</Notice>
      ) : null}

      {welcome ? (
        <Notice className="mb-6">
          <span className="font-medium text-foreground">Step 2 of 2.</span> Add
          a few questions your customers would ask an AI assistant, then run the
          first check.
        </Notice>
      ) : null}

      <Section title="Add questions">
        <QuestionForm autoFocus={Boolean(welcome)} />
      </Section>

      <Section
        className="mt-6"
        title={`Tracked questions (${rows.length})`}
        description="Score is the share of answers mentioning the brand, last 30 days."
        flush
      >
        {rows.length === 0 ? (
          <Muted className="px-6">No questions yet.</Muted>
        ) : (
          <Table className={TABLE_INSET}>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Cadence</TableHead>
                <TableHead className="text-right">Score</TableHead>
                <TableHead>Last run</TableHead>
                <TableHead className="text-right">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((q) => {
                const stat = stats.get(q.id)
                return (
                  <TableRow key={q.id}>
                    <TableCell className="whitespace-normal">
                      {q.text}
                      {!q.isActive ? (
                        <Badge variant="secondary" className="ml-2">
                          paused
                        </Badge>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <RowAction
                        id={q.id}
                        intent="cadence"
                        cadence={q.cadence === 'daily' ? 'weekly' : 'daily'}
                        label={q.cadence}
                      />
                    </TableCell>
                    <TableCell className="num text-right">
                      {fmtPct(stat?.score ?? null)}
                      {stat ? (
                        <span className="ml-1 text-xs text-muted-foreground">
                          {stat.answers}
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {fmtRelative(q.lastRunAt)}
                    </TableCell>
                    <TableCell className="space-x-3 text-right">
                      <RowAction
                        id={q.id}
                        intent="toggle"
                        label={q.isActive ? 'Pause' : 'Resume'}
                      />
                      <RowAction id={q.id} intent="delete" label="Delete" />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </Section>
    </>
  )
}
