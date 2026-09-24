import { z } from 'zod'

export const memorySaveSchema = z.object({
  content: z.string().describe('The fact or observation to remember'),
})

export type MemorySaveInput = z.infer<typeof memorySaveSchema>
