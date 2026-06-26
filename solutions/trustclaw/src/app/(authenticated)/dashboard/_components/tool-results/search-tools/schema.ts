import { z } from 'zod'
import { toolExecuteResponseSchema } from '../envelope'
import type { TerminalLogEntryData } from '../../terminal/types'

// ─── SEARCH_TOOLS ───────────────────────────────────────────────────────────

const searchResultSchema = z
  .object({
    use_case: z.string().optional(),
    primary_tool_slugs: z.array(z.string()).optional(),
    related_tool_slugs: z.array(z.string()).optional(),
    difficulty: z.string().optional(),
    known_pitfalls: z.array(z.string()).optional(),
    recommended_plan_steps: z.array(z.string()).optional(),
    execution_guidance: z.string().optional(),
  })
  .passthrough()

const connectionStatusSchema = z
  .object({
    toolkit: z.string(),
    has_active_connection: z.boolean().optional(),
    current_user_info: z
      .object({
        emailAddress: z.string().optional(),
        login: z.string().optional(),
        html_url: z.string().optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough()

const toolSchemaSchema = z
  .object({
    description: z.string().optional(),
  })
  .passthrough()

const searchToolsDataSchema = z
  .object({
    results: z.array(searchResultSchema),
    toolkit_connection_statuses: z.array(connectionStatusSchema),
    tool_schemas: z.record(toolSchemaSchema),
    time_info: z.unknown().optional(),
    next_steps_guidance: z.array(z.string()).optional(),
  })
  .passthrough()

export type SearchResult = z.infer<typeof searchResultSchema>
export type ConnectionStatus = z.infer<typeof connectionStatusSchema>
export type ToolSchema = z.infer<typeof toolSchemaSchema>
export type SearchToolResultData = z.infer<typeof searchToolsDataSchema>

export function parseSearchToolsResult(
  result: unknown
): SearchToolResultData | null {
  const envelope = toolExecuteResponseSchema.safeParse(result)
  if (!envelope.success) return null

  const data = searchToolsDataSchema.safeParse(envelope.data.data)
  if (!data.success) return null

  return {
    results: data.data.results,
    toolkit_connection_statuses: data.data.toolkit_connection_statuses,
    tool_schemas: data.data.tool_schemas,
    time_info: data.data.time_info,
    next_steps_guidance: data.data.next_steps_guidance,
  }
}

export function getSearchToolData(
  log: TerminalLogEntryData
): SearchToolResultData | null {
  if (!log.toolName.endsWith('SEARCH_TOOLS')) return null
  if (log.status !== 'complete' || log.result === undefined) return null
  return parseSearchToolsResult(log.result)
}
