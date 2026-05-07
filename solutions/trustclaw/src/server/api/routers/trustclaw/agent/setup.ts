import { ToolLoopAgent, stepCountIs } from 'ai'
import type { ToolSet, SystemModelMessage } from 'ai'
import { db } from '~/server/clients/db'
import { createComposioClient } from '~/server/clients/composio'
import { buildSystemPrompt } from './system-prompt'
import { createCustomTools, searchMemoriesForContext } from './tools'
import { getContextWindow } from './context/context-window'
import { pruneContext } from './context/context-pruning'
import {
  loadContextMessages,
  buildContext,
  toPlainRecordSafe,
  toPrismaJson,
  runPostResponseTasks,
  sanitizeString,
  deepSanitize,
} from './context/build-context'
import {
  DEFAULT_COMPACTION_SETTINGS,
  type CompactionSettings,
} from './context/token-estimation'
import { stripToolResultEchoes } from './strip-tool-echoes'
import { clearStreamingMessage } from '~/server/clients/redis'
import type { ReconstructedMessage } from './types'

type MessageSource = 'web' | 'telegram' | 'cron'

/**
 * Wraps every tool's execute function to sanitize its return value,
 * replacing lone Unicode surrogates with U+FFFD. Composio tool results
 * (e.g. scraped web pages, email bodies) can contain malformed Unicode
 * that produces invalid JSON when the AI SDK serializes the request
 * body for the Anthropic API.
 */
function sanitizeToolResults(tools: ToolSet): ToolSet {
  const wrapped: ToolSet = {}
  for (const [name, tool] of Object.entries(tools)) {
    if (tool.execute) {
      const originalExecute = tool.execute
      wrapped[name] = {
        ...tool,
        execute: async (...args: Parameters<typeof originalExecute>) => {
          const result = await originalExecute(...args)
          return deepSanitize(result)
        },
      }
    } else {
      wrapped[name] = tool
    }
  }
  return wrapped
}

interface PrepareAgentRunParams {
  instanceId: string
  userMessage: string
  source: MessageSource
  userMessageType?: 'hidden'
}

interface PrepareAgentRunResult {
  agent: ToolLoopAgent
  messages: ReconstructedMessage[]
}

type PrepareResult = { status: 'ready'; result: PrepareAgentRunResult }

export async function prepareAgentRun(
  params: PrepareAgentRunParams
): Promise<PrepareResult> {
  const { instanceId, userMessage, source, userMessageType } = params

  const instance = await db.composioClawInstance.findUnique({
    where: { id: instanceId },
  })

  if (!instance) {
    throw new Error('Instance not found')
  }

  const user = await db.user.findUnique({
    where: { id: instance.userId },
    select: { timezone: true },
  })

  const userTimezone = user?.timezone ?? 'UTC'

  const relevantMemories = await searchMemoriesForContext(
    instanceId,
    userMessage
  )

  const systemPrompt = sanitizeString(
    buildSystemPrompt({
      soulPrompt: instance.soulPrompt,
      identityPrompt: instance.identityPrompt,
      userPrompt: instance.userPrompt,
      relevantMemories,
      hasCompactionSummary: !!instance.lastCompactionSummary,
      userTimezone,
    })
  )

  const dbMessages = await loadContextMessages(
    instanceId,
    instance.lastCompactionAt
  )
  const aiMessages = buildContext(
    dbMessages,
    instance.lastCompactionSummary,
    userMessage
  )

  const contextWindow = getContextWindow(instance.anthropicModel)
  const { messages: prunedMessages } = pruneContext(aiMessages, contextWindow)

  // Add cache breakpoint to last history message (before new user message)
  // so the conversation prefix is cached across turns
  if (prunedMessages.length >= 2) {
    const lastHistoryIndex = prunedMessages.length - 2
    const msg = prunedMessages[lastHistoryIndex]!
    prunedMessages[lastHistoryIndex] = {
      ...msg,
      providerOptions: {
        anthropic: { cacheControl: { type: 'ephemeral' } },
      },
    }
  }

  await db.message.create({
    data: {
      instanceId,
      role: 'user',
      content: [{ type: 'text', text: userMessage }],
      source,
      ...(userMessageType && { messageType: userMessageType }),
    },
  })

  const composio = createComposioClient()
  const session = await composio.create(instance.userId, {
    manageConnections: {
      waitForConnections: true,
    },
  })
  const composioTools = await session.tools()

  const customTools = createCustomTools(instanceId, userTimezone)

  const allTools: ToolSet = sanitizeToolResults({
    ...composioTools,
    ...customTools,
  })

  // Pre-create assistant message row so we can update it in onFinish
  const assistantMessageRow = await db.message.create({
    data: {
      instanceId,
      role: 'assistant',
      content: toPrismaJson([]),
      source,
      inputTokens: 0,
      outputTokens: 0,
      cacheReadTokens: 0,
      cacheWriteTokens: 0,
    },
  })

  const modelString = instance.anthropicModel.startsWith('anthropic/')
    ? instance.anthropicModel
    : `anthropic/${instance.anthropicModel}`
  const model = modelString

  const agent = new ToolLoopAgent({
    model,
    instructions: {
      role: 'system',
      content: systemPrompt,
      providerOptions: {
        anthropic: { cacheControl: { type: 'ephemeral' } },
      },
    } satisfies SystemModelMessage,
    tools: allTools,
    stopWhen: stepCountIs(100),
    onFinish: async (result) => {
      try {
        const { totalUsage, steps } = result
        const inputTokens = totalUsage.inputTokens ?? 0
        const outputTokens = totalUsage.outputTokens ?? 0
        const cacheReadTokens =
          totalUsage.inputTokenDetails?.cacheReadTokens ?? 0
        const cacheWriteTokens =
          totalUsage.inputTokenDetails?.cacheWriteTokens ?? 0

        // Build assistant content from steps (UIMessage parts format)
        const assistantParts: Array<Record<string, unknown>> = []

        for (const step of steps) {
          for (let i = 0; i < step.toolCalls.length; i++) {
            const tc = step.toolCalls[i]!
            const tr = step.toolResults[i]
            const tcInput = toPlainRecordSafe(tc.input)
            const tcResult = tr ? toPlainRecordSafe(tr.output) : null

            assistantParts.push({
              type: 'dynamic-tool' as const,
              toolCallId: tc.toolCallId,
              toolName: tc.toolName,
              state: tcResult ? 'output-available' : 'input-available',
              input: tcInput,
              output: tcResult ?? {},
            })
          }

          const stepText = stripToolResultEchoes(step.text)
          if (stepText) {
            assistantParts.push({ type: 'text' as const, text: stepText })
          }
        }

        // Update the pre-created assistant message with final content + totals
        await db.message.update({
          where: { id: assistantMessageRow.id },
          data: {
            content: toPrismaJson(assistantParts),
            inputTokens,
            outputTokens,
            cacheReadTokens,
            cacheWriteTokens,
          },
        })

        // Fire-and-forget post-response tasks
        const totalContextTokens = inputTokens + outputTokens
        const settings: CompactionSettings = {
          contextWindow,
          ...DEFAULT_COMPACTION_SETTINGS,
        }

        void runPostResponseTasks({
          instanceId,
          instance: {
            anthropicModel: instance.anthropicModel,
            compactionCount: instance.compactionCount,
            memoryFlushCount: instance.memoryFlushCount,
            lastCompactionSummary: instance.lastCompactionSummary,
            lastCompactionAt: instance.lastCompactionAt,
          },
          contextTokens: totalContextTokens,
          settings,
          prunedMessages,
        })
      } catch (error) {
        console.error('[agent/onFinish] post-stream processing failed:', error)
      } finally {
        await clearStreamingMessage(instanceId).catch((error) =>
          console.error('[agent/onFinish] clearStreamingMessage failed:', error)
        )
      }
    },
  })

  return {
    status: 'ready',
    result: {
      agent,
      messages: prunedMessages,
    },
  }
}

export type {
  PrepareAgentRunParams,
  PrepareResult,
  PrepareAgentRunResult,
  MessageSource,
}
