import { z } from 'zod'

export const scheduleSchema = z.object({
  action: z
    .enum(['create', 'list', 'delete'])
    .describe('The action to perform'),
  expression: z
    .string()
    .optional()
    .describe('Cron expression for scheduling (required for create)'),
  prompt: z
    .string()
    .optional()
    .describe('The task prompt to run on schedule (required for create)'),
  timezone: z
    .string()
    .optional()
    .describe("IANA timezone for the schedule (defaults to user's timezone)"),
  jobId: z
    .string()
    .optional()
    .describe('Job ID to delete (required for delete)'),
})

export type ScheduleInput = z.infer<typeof scheduleSchema>
