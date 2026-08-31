import { z } from 'zod'

export const deleteCronJobInput = z.object({
  jobId: z.string().min(1),
})

export type DeleteCronJobInput = z.infer<typeof deleteCronJobInput>
