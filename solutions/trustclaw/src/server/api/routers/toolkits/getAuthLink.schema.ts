import { z } from 'zod'

export const getAuthLinkInput = z.object({
  toolkit: z.string().min(1),
})

export type GetAuthLinkInput = z.infer<typeof getAuthLinkInput>
