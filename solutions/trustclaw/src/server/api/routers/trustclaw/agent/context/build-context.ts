import { z } from 'zod'
import { db } from '~/server/clients/db'
import type { Prisma } from '~/generated/prisma/client'
import type {
  ReconstructedMessage,
  JsonValue,
  ToolResultOutput,
} from '../types'
import {
  shouldCompact,
  shouldFlushMemory,
  type CompactionSettings,
} from './token-estimation'
import { runCompaction } from '../compaction/run-compaction'
import { runMemoryFlush } from '../compaction/memory-flush'
import { COMPACTION_SUMMARY_PREFIX } from '../compaction/prompts'

const MESSAGE_SAFETY_CAP = 200

// Lone surrogates in strings produce invalid JSON when serialized for the Anthropic API.
// This can happen when external tool results (e.g. from Composio) contain malformed Unicode.
const LONE_SURROGATE_RE =
  /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g

function sanitizeString(str: string): string {
  return str.replace(LONE_SURROGATE_RE, '\uFFFD')
}

function deepSanitize<T>(value: T): T {
  if (typeof value === 'string') {
    return sanitizeString(value) as T
  }
  if (Array.isArray(value)) {
    return value.map(deepSanitize) as T
  }
  if (value !== null && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) {
      out[k] = deepSanitize(v)
    }
    return out as T
  }
  return value
}

export const contentPartSchema = z.object({
  type: z.string(),
  text: z.string().optional(),
})

export const contentSchema = z.array(contentPartSchema)

export const plainRecordSchema = z.record(z.unknown())

export const jsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([
    z.null(),
    z.string(),
    z.number(),
    z.boolean(),
    z.array(jsonValueSchema),
    z.record(jsonValueSchema),
  ])
)

export { sanitizeString, deepSanitize }

export function toJsonValue(value: unknown): JsonValue {
  const parsed = jsonValueSchema.safeParse(value ?? {})
  return parsed.success ? deepSanitize(parsed.data) : {}
}

export function toToolResultOutput(value: unknown): ToolResultOutput {
  return { type: 'json', value: toJsonValue(value) }
}

export function toPlainRecord(value: unknown): Record<string, unknown> {
  const raw: unknown = JSON.parse(JSON.stringify(value ?? {}))
  return plainRecordSchema.parse(raw)
}

export function toPlainRecordSafe(value: unknown): Record<string, unknown> {
  const result = plainRecordSchema.safeParse(
    JSON.parse(JSON.stringify(value ?? {}))
  )
  if (!result.success) {
    console.error(
      '[toPlainRecordSafe] Non-record tool input fell back to {}:',
      typeof value
    )
  }
  return result.success ? result.data : {}
}

export function toPrismaJson(value: unknown): Prisma.InputJsonValue {
  return toJsonValue(
    JSON.parse(JSON.stringify(value ?? {}))
  ) satisfies JsonValue as Prisma.InputJsonValue
}

export async function loadContextMessages(
  instanceId: string,
  lastCompactionAt: Date | null
) {
  // Prisma applies `take` at the database query level, so ordering matters
  // when more than MESSAGE_SAFETY_CAP regular messages exist since the last
  // compaction point. We want the NEWEST capped messages (recent context is
  // what matters to the agent), so order descending, take the cap, then
  // reverse back into chronological order before returning.
  const rows = await db.message.findMany({
    where: {
      instanceId,
      messageType: 'regular',
      ...(lastCompactionAt ? { createdAt: { gte: lastCompactionAt } } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: MESSAGE_SAFETY_CAP,
    select: {
      role: true,
      content: true,
    },
  })
  return rows.reverse()
}

export function buildContext(
  dbMessages: Awaited<ReturnType<typeof loadContextMessages>>,
  lastCompactionSummary: string | null,
  userMessage: string
): ReconstructedMessage[] {
  const aiMessages = deepSanitize(reconstructMessages(dbMessages))

  if (lastCompactionSummary) {
    aiMessages.unshift({
      role: 'user' as const,
      content: sanitizeString(
        `${COMPACTION_SUMMARY_PREFIX}\n\n<summary>\n${lastCompactionSummary}\n</summary>`
      ),
    })
  }

  aiMessages.push({
    role: 'user' as const,
    content: sanitizeString(userMessage),
  })

  return aiMessages
}

const dynamicToolPartSchema = z.object({
  type: z.literal('dynamic-tool'),
  toolCallId: z.string(),
  toolName: z.string(),
  state: z.string(),
  input: z.unknown().optional(),
  output: z.unknown().optional(),
})

export function reconstructMessages(
  messages: Array<{
    role: string
    content: unknown
  }>
): ReconstructedMessage[] {
  const result: ReconstructedMessage[] = []

  for (const msg of messages) {
    const role = msg.role === 'assistant' ? 'assistant' : 'user'

    const contentArray = Array.isArray(msg.content) ? msg.content : []
    const parsed = contentSchema.safeParse(contentArray)
    const contentParts = parsed.success ? parsed.data : []

    const textContent = contentParts
      .filter((p) => p.type === 'text' && p.text)
      .map((p) => p.text!)
      .join('\n')

    if (role === 'user') {
      result.push({ role: 'user', content: textContent || '(empty)' })
      continue
    }

    // Extract dynamic-tool parts from content JSON
    const toolParts = contentArray
      .map((item: unknown) => dynamicToolPartSchema.safeParse(item))
      .filter(
        (r): r is z.SafeParseSuccess<z.infer<typeof dynamicToolPartSchema>> =>
          r.success
      )
      .map((r) => r.data)

    if (toolParts.length === 0) {
      result.push({ role: 'assistant', content: textContent || '(empty)' })
      continue
    }

    const assistantContent: Array<
      | { type: 'text'; text: string }
      | {
          type: 'tool-call'
          toolCallId: string
          toolName: string
          input: Record<string, unknown>
        }
    > = []
    if (textContent) {
      assistantContent.push({ type: 'text', text: textContent })
    }
    for (const tc of toolParts) {
      assistantContent.push({
        type: 'tool-call',
        toolCallId: tc.toolCallId,
        toolName: tc.toolName,
        input: toPlainRecordSafe(tc.input),
      })
    }
    result.push({ role: 'assistant', content: assistantContent })

    result.push({
      role: 'tool',
      content: toolParts.map((tc) => ({
        type: 'tool-result' as const,
        toolCallId: tc.toolCallId,
        toolName: tc.toolName,
        output: toToolResultOutput(tc.output),
      })),
    })
  }

  return result
}

export async function runPostResponseTasks(params: {
  instanceId: string
  instance: {
    anthropicModel: string
    compactionCount: number
    memoryFlushCount: number
    lastCompactionSummary: string | null
    lastCompactionAt: Date | null
  }
  contextTokens: number
  settings: CompactionSettings
  prunedMessages: ReconstructedMessage[]
}): Promise<void> {
  const { instanceId, instance, contextTokens, settings, prunedMessages } =
    params

  if (
    shouldFlushMemory(
      contextTokens,
      settings,
      instance.compactionCount,
      instance.memoryFlushCount
    )
  ) {
    try {
      await runMemoryFlush({
        instanceId,
        anthropicModel: instance.anthropicModel,
        messages: prunedMessages,
        compactionCount: instance.compactionCount,
      })
    } catch {
      // Flush failure is non-fatal
    }
  }

  if (shouldCompact(contextTokens, settings)) {
    try {
      const freshDbMessages = await loadContextMessages(
        instanceId,
        instance.lastCompactionAt
      )
      const freshAiMessages = reconstructMessages(freshDbMessages)

      await runCompaction({
        instanceId,
        anthropicModel: instance.anthropicModel,
        messages: freshAiMessages,
        keepRecentTokens: settings.keepRecentTokens,
        previousSummary: instance.lastCompactionSummary,
        compactionCount: instance.compactionCount,
      })
    } catch {
      // Compaction failure is non-fatal - next turn will retry
    }
  }
}
