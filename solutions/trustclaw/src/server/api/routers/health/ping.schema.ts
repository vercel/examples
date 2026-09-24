import { z } from 'zod'

export const pingOutput = z.object({
  status: z.string(),
  timestamp: z.string(),
})

export type PingOutput = z.infer<typeof pingOutput>
