import { zodSchema } from 'ai'
import type { Tool } from 'ai'
import { db } from '~/server/clients/db'
import { computeNextRunAt, validateCronExpression } from './cron-utils'
import { scheduleSchema, type ScheduleInput } from './schedule.schema'

export function createScheduleTool(
  instanceId: string,
  defaultTimezone: string
): Tool<ScheduleInput, Record<string, unknown>> {
  return {
    description: 'Create, list, or delete scheduled tasks',
    inputSchema: zodSchema(scheduleSchema),
    execute: async ({ action, expression, prompt, timezone, jobId }) => {
      const tz = timezone ?? defaultTimezone

      switch (action) {
        case 'create': {
          if (!expression || !prompt) {
            return {
              error: "Both 'expression' and 'prompt' are required for create",
            }
          }

          try {
            if (!validateCronExpression(expression)) {
              return { error: 'Invalid cron expression' }
            }

            const nextRun = computeNextRunAt(expression, tz)

            const job = await db.cronJob.create({
              data: {
                instanceId,
                expression,
                prompt,
                timezone: tz,
                nextRunAt: nextRun,
              },
              select: {
                id: true,
                expression: true,
                prompt: true,
                nextRunAt: true,
              },
            })

            return {
              created: true,
              jobId: job.id,
              expression: job.expression,
              prompt: job.prompt,
              nextRunAt: job.nextRunAt?.toISOString(),
            }
          } catch {
            return { error: 'Invalid cron expression' }
          }
        }

        case 'list': {
          const jobs = await db.cronJob.findMany({
            where: { instanceId, enabled: true },
            select: {
              id: true,
              expression: true,
              prompt: true,
              timezone: true,
              lastRunAt: true,
              nextRunAt: true,
            },
            orderBy: { nextRunAt: 'asc' },
          })

          return {
            jobs: jobs.map((j) => ({
              jobId: j.id,
              expression: j.expression,
              prompt: j.prompt,
              timezone: j.timezone,
              lastRunAt: j.lastRunAt?.toISOString() ?? null,
              nextRunAt: j.nextRunAt?.toISOString() ?? null,
            })),
          }
        }

        case 'delete': {
          if (!jobId) {
            return { error: "'jobId' is required for delete" }
          }

          const job = await db.cronJob.findFirst({
            where: { id: jobId, instanceId },
          })

          if (!job) {
            return { error: 'Job not found' }
          }

          await db.cronJob.delete({ where: { id: jobId } })

          return { deleted: true, jobId }
        }
      }
    },
  }
}
