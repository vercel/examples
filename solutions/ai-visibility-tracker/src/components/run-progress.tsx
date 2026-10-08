'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { resumeRun } from '@/app/actions/runs'
import { TABLE_INSET } from '@/components/blocks'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { platformLabel } from '@/lib/platforms'
import type { RunProgress } from '@/lib/queries/runs'

const POLL_MS = 3000

export function RunProgressView({ initial }: { initial: RunProgress }) {
  const [progress, setProgress] = useState(initial)
  const { run, items } = progress
  const active = run.status === 'queued' || run.status === 'running'

  useEffect(() => {
    if (!active) return
    let cancelled = false
    const timer = setInterval(async () => {
      try {
        const response = await fetch(`/api/runs/${run.id}/status`, {
          cache: 'no-store',
        })
        if (!response.ok) return
        const next = (await response.json()) as RunProgress
        if (!cancelled) setProgress(next)
      } catch {
        // keep polling
      }
    }, POLL_MS)
    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [active, run.id])

  const finished = run.doneItems + run.failedItems
  const pct =
    run.totalItems === 0 ? 100 : Math.round((finished / run.totalItems) * 100)
  const stalled =
    active &&
    items.every((i) => i.status !== 'running') &&
    items.some((i) => i.status === 'pending')

  return (
    <div className="space-y-6">
      <Card size="sm">
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              <span className="num font-medium text-foreground">
                {finished} / {run.totalItems}
              </span>{' '}
              answers ·{' '}
              {run.failedItems > 0 ? `${run.failedItems} failed · ` : ''}
              {statusLabel(run.status)}
            </p>
            {active ? (
              <span className="text-xs text-muted-foreground">
                Updates every few seconds
              </span>
            ) : (
              <Button asChild size="sm">
                <Link href="/">View report</Link>
              </Button>
            )}
          </div>
          <Progress value={pct} aria-label="Run progress" />
          {stalled ? (
            <form
              action={resumeRun}
              className="flex items-center gap-3 text-sm text-muted-foreground"
            >
              <input type="hidden" name="runId" value={run.id} />
              <span>Nothing is being processed right now.</span>
              <Button type="submit" variant="outline" size="sm">
                Resume
              </Button>
            </form>
          ) : null}
        </CardContent>
      </Card>

      <Card className="py-0">
        <Table className={TABLE_INSET}>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Result</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="whitespace-normal">
                  {item.questionText}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {platformLabel(item.platform)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={item.status === 'done' ? 'outline' : 'secondary'}
                  >
                    {statusLabel(item.status)}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-normal text-muted-foreground">
                  {item.status === 'done' ? (
                    <Link
                      href={`/answers/${item.id}`}
                      className="text-foreground underline-offset-4 hover:underline"
                    >
                      {item.brandMentioned ? 'Mentioned' : 'Not mentioned'}
                      {item.brandCited ? ' · cited' : ''}
                    </Link>
                  ) : item.status === 'failed' ? (
                    <span title={item.error ?? undefined}>
                      {item.error ? truncate(item.error) : 'Failed'}
                    </span>
                  ) : (
                    '—'
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

function statusLabel(status: string): string {
  switch (status) {
    case 'queued':
      return 'Queued'
    case 'running':
      return 'Running'
    case 'done':
      return 'Done'
    case 'pending':
      return 'Pending'
    case 'completed':
      return 'Completed'
    case 'failed':
      return 'Failed'
    default:
      return status
  }
}

function truncate(text: string, max = 90): string {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text
}
