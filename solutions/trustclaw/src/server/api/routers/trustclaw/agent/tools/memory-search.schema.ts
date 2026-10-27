import { z } from 'zod'

export const memorySearchSchema = z.object({
  query: z.string().describe('What to search for in memory'),
  maxResults: z
    .number()
    .optional()
    .describe('Maximum number of results to return (defaults to 5)'),
})

export type MemorySearchInput = z.infer<typeof memorySearchSchema>
