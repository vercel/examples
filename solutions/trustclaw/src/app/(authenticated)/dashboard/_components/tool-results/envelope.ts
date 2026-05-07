import { z } from 'zod'

export const toolExecuteResponseSchema = z
  .object({
    data: z.record(z.unknown()).optional(),
    error: z.string().nullable().optional(),
    successful: z.boolean().optional(),
  })
  .passthrough()

export function parseToolResult(
  result: unknown
): { successful?: boolean; error?: string | null } | null {
  const parsed = toolExecuteResponseSchema.safeParse(result)
  if (!parsed.success) return null
  return { successful: parsed.data.successful, error: parsed.data.error }
}
