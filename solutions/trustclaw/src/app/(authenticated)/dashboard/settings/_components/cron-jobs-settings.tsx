'use client'

import moment from 'moment'
import { Calendar, Clock, Loader2, Trash2 } from 'lucide-react'
import { trpc } from '~/clients/trpc'
import { Button } from '~/components/ui/button'
import { Switch } from '~/components/ui/switch'
import { AlertDialog } from '~/components/core/confirm-dialog'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import {
  showSuccessToast,
  trpcToastOnError,
} from '~/components/core/toast-notifications'
import { VirtualizedList } from '~/components/core/virtualized-list'

function formatCronExpression(expression: string): string {
  const parts = expression.split(' ')
  if (parts.length !== 5) return expression

  const minute = parts[0] ?? '0'
  const hour = parts[1] ?? '*'
  const dayOfMonth = parts[2] ?? '*'
  const month = parts[3] ?? '*'
  const dayOfWeek = parts[4] ?? '*'

  if (dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
    if (minute === '0' && hour === '*') return 'Every hour'
    if (hour === '*') return `Every hour at :${minute.padStart(2, '0')}`
    return `Daily at ${hour}:${minute.padStart(2, '0')}`
  }

  if (dayOfWeek !== '*' && dayOfMonth === '*' && month === '*') {
    const days: Record<string, string> = {
      '0': 'Sunday',
      '1': 'Monday',
      '2': 'Tuesday',
      '3': 'Wednesday',
      '4': 'Thursday',
      '5': 'Friday',
      '6': 'Saturday',
    }
    const dayName = days[dayOfWeek] ?? dayOfWeek
    return `Every ${dayName} at ${hour}:${minute.padStart(2, '0')}`
  }

  return expression
}

function formatDate(date: Date | null): string {
  if (!date) return '\u2014'
  return moment(date).format('MMM D, h:mm A')
}

export function CronJobsSettings() {
  const utils = trpc.useUtils()

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    trpc.trustclaw.getCronJobs.useInfiniteQuery(
      { limit: 20 },
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    )

  const cronJobs = data?.pages.flatMap((page) => page.items) ?? []

  const toggleCronJob = trpc.trustclaw.toggleCronJob.useMutation({
    onSuccess: () => {
      void utils.trustclaw.getCronJobs.invalidate()
    },
    onError: trpcToastOnError,
  })

  const deleteCronJob = trpc.trustclaw.deleteCronJob.useMutation({
    onSuccess: () => {
      showSuccessToast('Cron job deleted')
      void utils.trustclaw.getCronJobs.invalidate()
    },
    onError: trpcToastOnError,
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scheduled Tasks</CardTitle>
        <CardDescription>
          Cron jobs that run your agent on a schedule
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : cronJobs.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-6 text-center">
            <Calendar className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No scheduled tasks. Ask your agent to schedule something!
            </p>
          </div>
        ) : (
          <VirtualizedList
            items={cronJobs}
            renderItem={(job) => (
              <div className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="truncate text-sm font-medium">{job.prompt}</p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatCronExpression(job.expression)}
                    </span>
                    {job.nextRunAt && (
                      <span>Next: {formatDate(job.nextRunAt)}</span>
                    )}
                    {!job.enabled && <Badge variant="secondary">Paused</Badge>}
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Switch
                    checked={job.enabled}
                    onCheckedChange={(checked) =>
                      void toggleCronJob.mutateAsync({
                        jobId: job.id,
                        enabled: checked,
                      })
                    }
                    disabled={toggleCronJob.isPending}
                  />
                  <AlertDialog
                    trigger={
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        disabled={deleteCronJob.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    }
                    title="Delete Cron Job"
                    description={`This will permanently delete the scheduled task: "${job.prompt}"`}
                    confirmLabel="Delete"
                    onConfirm={() =>
                      void deleteCronJob.mutateAsync({ jobId: job.id })
                    }
                    isPending={deleteCronJob.isPending}
                  />
                </div>
              </div>
            )}
            estimateSize={100}
            className="max-h-64 md:max-h-96"
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                void fetchNextPage()
              }
            }}
            footer={
              isFetchingNextPage ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : null
            }
          />
        )}
      </CardContent>
    </Card>
  )
}
