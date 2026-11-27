import { z } from 'zod'

export const getCronJobsInput = z.object({
  cursor: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
})

export type GetCronJobsInput = z.infer<typeof getCronJobsInput>
