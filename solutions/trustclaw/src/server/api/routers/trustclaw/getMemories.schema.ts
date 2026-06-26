import { z } from 'zod'

export const getMemoriesInput = z.object({
  cursor: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
})

export type GetMemoriesInput = z.infer<typeof getMemoriesInput>

export const memoryRow = z.object({
  id: z.string(),
  content: z.string(),
  createdAt: z.coerce.date(),
})

export type MemoryRow = z.infer<typeof memoryRow>
