import { z } from 'zod'

export const checkConnectionStatusInput = z.object({
  toolkits: z.array(z.string()).min(1),
})

export type CheckConnectionStatusInput = z.infer<
  typeof checkConnectionStatusInput
>
