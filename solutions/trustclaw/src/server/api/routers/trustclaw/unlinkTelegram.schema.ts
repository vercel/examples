import { z } from 'zod'

export const unlinkTelegramOutput = z.object({
  success: z.boolean(),
})

export type UnlinkTelegramOutput = z.infer<typeof unlinkTelegramOutput>
