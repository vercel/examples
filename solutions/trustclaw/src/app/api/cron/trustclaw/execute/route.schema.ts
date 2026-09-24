import { z } from 'zod'

export const executeJobInput = z.object({
  jobIds: z.array(z.string()).min(1),
  invocationId: z.string(),
  nowOverride: z.string().datetime().optional(),
})

export type ExecuteJobInput = z.infer<typeof executeJobInput>

export const cronJobRow = z.object({
  id: z.string(),
  instanceId: z.string(),
  expression: z.string(),
  prompt: z.string(),
  timezone: z.string(),
  lockedBy: z.string().nullable(),
  telegramChatId: z.string().nullable(),
})

export type CronJobRow = z.infer<typeof cronJobRow>
