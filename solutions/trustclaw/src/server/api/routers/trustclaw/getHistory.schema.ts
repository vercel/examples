import { z } from 'zod'

export const getHistoryInput = z.object({
  limit: z.number().min(1).max(100).default(50),
  cursor: z.string().datetime().optional(),
})

export type GetHistoryInput = z.infer<typeof getHistoryInput>
