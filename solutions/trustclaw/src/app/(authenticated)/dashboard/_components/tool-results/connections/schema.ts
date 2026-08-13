import { z } from 'zod'
import { toolExecuteResponseSchema } from '../envelope'
import type { TerminalLogEntryData } from '../../terminal/types'

// ─── MANAGE_CONNECTIONS ─────────────────────────────────────────────────────

const connectionResultSchema = z
  .object({
    toolkit: z.string(),
    status: z.string(),
    redirect_url: z
      .string()
      .url()
      .refine((url) => url.startsWith('https://'), {
        message: 'Only HTTPS URLs are allowed',
      })
      .optional(),
    instruction: z.string().optional(),
    was_reinitiated: z.boolean().optional(),
  })
  .passthrough()

const manageConnectionsDataSchema = z
  .object({
    results: z.record(connectionResultSchema),
    message: z.string().optional(),
  })
  .passthrough()

export type ConnectionResult = z.infer<typeof connectionResultSchema>

export type ConnectionToolResultData = {
  toolkits: string[]
  results: Record<string, ConnectionResult>
  message?: string
}

export function parseManageConnectionsResult(
  result: unknown,
  args: Record<string, unknown>
): ConnectionToolResultData | null {
  const envelope = toolExecuteResponseSchema.safeParse(result)
  if (!envelope.success) return null

  const data = manageConnectionsDataSchema.safeParse(envelope.data.data)
  if (!data.success) return null

  const toolkitsRaw = z.array(z.string()).safeParse(args.toolkits)
  const toolkits = toolkitsRaw.success ? toolkitsRaw.data : []
  if (toolkits.length === 0) return null

  return {
    toolkits,
    results: data.data.results,
    message: data.data.message,
  }
}

const manageConnectionsArgsSchema = z
  .object({
    toolkits: z.array(z.string()),
  })
  .passthrough()

export function parseManageConnectionsArgs(
  args: Record<string, unknown>
): { toolkits: string[] } | null {
  const parsed = manageConnectionsArgsSchema.safeParse(args)
  if (!parsed.success) return null
  return { toolkits: parsed.data.toolkits }
}

export function getConnectionData(
  log: TerminalLogEntryData
): ConnectionToolResultData | null {
  if (!log.toolName.endsWith('MANAGE_CONNECTIONS')) return null
  if (log.status !== 'complete' || !log.result) return null
  return parseManageConnectionsResult(log.result, log.args)
}
