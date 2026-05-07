import { z } from 'zod'

export const getToolkitsInput = z.object({
  search: z.string().optional(),
  isConnected: z.boolean().optional(),
  cursor: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
})

export type GetToolkitsInput = z.infer<typeof getToolkitsInput>

export const toolkitItem = z.object({
  slug: z.string(),
  name: z.string(),
  logo: z.string(),
  noAuth: z.boolean(),
  connected: z.boolean(),
})

export type ToolkitItem = z.infer<typeof toolkitItem>
