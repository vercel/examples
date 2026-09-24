import { z } from 'zod'

const composioApiErrorSchema = z
  .object({
    error: z
      .object({
        message: z.string().optional(),
        suggested_fix: z.string().optional(),
      })
      .optional(),
  })
  .passthrough()

export function parseAgentError(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error)

  const jsonMatch = /\d{3}\s*(\{.*\})/.exec(raw)
  if (jsonMatch?.[1]) {
    try {
      const rawJson: unknown = JSON.parse(jsonMatch[1])
      const parsed = composioApiErrorSchema.safeParse(rawJson)
      if (parsed.success) {
        if (parsed.data.error?.suggested_fix) {
          return parsed.data.error.suggested_fix
        }
        if (parsed.data.error?.message) {
          return parsed.data.error.message
        }
      }
    } catch {
      // Fall through
    }
  }

  if (raw.includes('invalid x-api-key') || raw.includes('invalid_api_key')) {
    return 'Invalid Anthropic API key. Please check the server configuration.'
  }

  if (raw.includes('rate_limit') || raw.includes('429')) {
    return 'Rate limit exceeded. Please wait a moment and try again.'
  }

  return 'Something went wrong. Please try again.'
}
