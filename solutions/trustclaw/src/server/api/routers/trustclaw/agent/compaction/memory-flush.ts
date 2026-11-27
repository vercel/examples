import { generateText, stepCountIs } from 'ai'
import { db } from '~/server/clients/db'
import { createCustomTools } from '../tools'
import { serializeMessages } from './prompts'
import type { ReconstructedMessage } from '../types'

const FLUSH_SYSTEM_PROMPT =
  'Pre-compaction memory flush turn. ' +
  'The session is near auto-compaction; capture durable memories now. ' +
  'You have access to memory_save and memory_search. ' +
  'Save any important context, user preferences, decisions, or ongoing task state that should persist beyond this conversation window. ' +
  'If nothing needs saving, respond with <silent/>.'

const FLUSH_USER_PROMPT =
  'Pre-compaction memory flush. ' +
  'Store durable memories now using memory_save. ' +
  'Focus on: user preferences, key decisions, task progress, important context. ' +
  'If nothing to store, reply with <silent/>.'

interface MemoryFlushParams {
  instanceId: string
  anthropicModel: string
  messages: ReconstructedMessage[]
  compactionCount: number
}

interface MemoryFlushResult {
  memoriesSaved: number
}

export async function runMemoryFlush(
  params: MemoryFlushParams
): Promise<MemoryFlushResult> {
  const { instanceId, anthropicModel, messages, compactionCount } = params

  try {
    // Atomically claim this flush cycle BEFORE invoking the LLM. Two
    // concurrent post-response tasks for the same instance can both
    // observe the same stale `memoryFlushCount` via `shouldFlushMemory`,
    // but only one can win this UPDATE. The loser sees count === 0 and
    // exits without spending tokens or duplicating memory_save inserts.
    const claim = await db.composioClawInstance.updateMany({
      where: {
        id: instanceId,
        memoryFlushCount: { lte: compactionCount },
      },
      data: { memoryFlushCount: compactionCount + 1 },
    })
    if (claim.count === 0) {
      return { memoriesSaved: 0 }
    }

    const modelString = anthropicModel.startsWith('anthropic/')
      ? anthropicModel
      : `anthropic/${anthropicModel}`

    const allCustomTools = createCustomTools(instanceId)
    const memoryTools = {
      memory_save: allCustomTools.memory_save,
      memory_search: allCustomTools.memory_search,
    }

    const contextSummary = serializeMessages(messages)
    const flushPrompt = `Here is the recent conversation context:\n\n${contextSummary}\n\n${FLUSH_USER_PROMPT}`

    const result = await generateText({
      model: modelString,
      system: FLUSH_SYSTEM_PROMPT,
      messages: [{ role: 'user' as const, content: flushPrompt }],
      tools: memoryTools,
      stopWhen: stepCountIs(3),
      maxOutputTokens: 1_000,
    })

    let memoriesSaved = 0
    for (const step of result.steps) {
      for (const toolCall of step.toolCalls) {
        if (toolCall.toolName === 'memory_save') {
          memoriesSaved++
        }
      }
    }

    // Persist the flush turn for transcript history. The counter was
    // already incremented atomically above, so this transaction only
    // needs to record the messages.
    await db.$transaction(async (tx) => {
      await tx.message.create({
        data: {
          instanceId,
          role: 'user',
          content: [{ type: 'text', text: FLUSH_USER_PROMPT }],
          source: 'web',
          messageType: 'memory_flush',
        },
      })

      await tx.message.create({
        data: {
          instanceId,
          role: 'assistant',
          content: [{ type: 'text', text: result.text || '<silent/>' }],
          source: 'web',
          messageType: 'memory_flush',
        },
      })
    })

    return { memoriesSaved }
  } catch {
    return { memoriesSaved: 0 }
  }
}
