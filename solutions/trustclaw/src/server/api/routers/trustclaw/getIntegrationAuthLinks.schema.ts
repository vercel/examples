import { z } from 'zod'

export const getIntegrationAuthLinksOutput = z.object({
  integrations: z.array(
    z.object({
      toolkit: z.string(),
      name: z.string(),
      logo: z.string().nullable(),
      connected: z.boolean(),
      redirectUrl: z.string().nullable(),
    })
  ),
})

export type GetIntegrationAuthLinksOutput = z.infer<
  typeof getIntegrationAuthLinksOutput
>
