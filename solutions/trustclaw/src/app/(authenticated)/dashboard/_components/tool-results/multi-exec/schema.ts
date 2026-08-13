import { z } from 'zod'
import { toolExecuteResponseSchema } from '../envelope'
import type { TerminalLogEntryData } from '../../terminal/types'

// ─── MULTI_EXECUTE_TOOL ─────────────────────────────────────────────────────

export type MultiExecTool = {
  slug: string
  status: 'success' | 'error' | 'pending'
  error?: string
}

const multiExecToolInputSchema = z
  .object({
    tool_slug: z.string().optional(),
  })
  .passthrough()

const multiExecArgsSchema = z
  .object({
    thought: z.string().optional(),
    tools: z.array(multiExecToolInputSchema),
  })
  .passthrough()

const multiExecResponseItemSchema = z
  .object({
    successful: z.boolean().optional(),
    error: z.string().optional(),
  })
  .passthrough()

const multiExecNestedResultSchema = z
  .object({
    response: multiExecResponseItemSchema.optional(),
  })
  .passthrough()

const multiExecDataSchema = z
  .object({
    results: z.array(multiExecNestedResultSchema),
  })
  .passthrough()

export function parseMultiExecResult(
  result: unknown,
  args: Record<string, unknown>
): { thought?: string; tools: MultiExecTool[] } | null {
  const parsedArgs = multiExecArgsSchema.safeParse(args)
  if (!parsedArgs.success) return null

  const toolsInput = parsedArgs.data.tools
  if (toolsInput.length === 0) return null

  const thought = parsedArgs.data.thought

  const envelope = toolExecuteResponseSchema.safeParse(result)

  // If no valid result yet (executing state), return pending tools
  if (!envelope.success || !result) {
    return {
      thought,
      tools: toolsInput
        .map((t) => t.tool_slug)
        .filter((s): s is string => Boolean(s))
        .map((slug) => ({ slug, status: 'pending' as const })),
    }
  }

  // Try Shape A: result.response_data is an array
  let resultsArray: Array<{ successful?: boolean; error?: string }> = []

  const shapeA = z
    .object({ response_data: z.array(multiExecResponseItemSchema) })
    .passthrough()
    .safeParse(result)

  if (shapeA.success) {
    resultsArray = shapeA.data.response_data
  } else {
    // Try Shape B: result.data.results is an array with nested response
    const dataResults = multiExecDataSchema.safeParse(envelope.data.data)
    if (dataResults.success) {
      resultsArray = dataResults.data.results.map(
        (r) => r.response ?? { successful: undefined, error: undefined }
      )
    }
  }

  const tools: MultiExecTool[] = toolsInput.map((t, i) => {
    const slug = t.tool_slug ?? 'unknown'
    const toolResult = resultsArray[i]
    if (!toolResult) return { slug, status: 'success' as const }

    const isErr =
      toolResult.successful === false ||
      (typeof toolResult.error === 'string' && toolResult.error.length > 0)

    return {
      slug,
      status: isErr ? ('error' as const) : ('success' as const),
      error: isErr ? toolResult.error : undefined,
    }
  })

  return { thought, tools }
}

export function parseMultiExecArgs(
  args: Record<string, unknown>
): { thought?: string; slugs: string[] } | null {
  const parsed = multiExecArgsSchema.safeParse(args)
  if (!parsed.success) return null

  const slugs = parsed.data.tools
    .map((t) => t.tool_slug)
    .filter((s): s is string => Boolean(s))

  return { thought: parsed.data.thought, slugs }
}

export function getMultiExecInfo(
  log: TerminalLogEntryData
): { thought?: string; tools: MultiExecTool[] } | null {
  if (!log.toolName.endsWith('MULTI_EXECUTE_TOOL')) return null
  return parseMultiExecResult(log.result, log.args)
}
