// Adapted from pi-mono: packages/coding-agent/src/core/compaction/compaction.ts:376-438 (cut point algorithm)
// Adaptive chunking / staged summarization from openclaw: src/agents/compaction.ts:110-129, 244-305
// Fallback chain from openclaw: src/agents/compaction.ts:176-242
import { generateText } from 'ai'
import { db } from '~/server/clients/db'
import type { ReconstructedMessage } from '../types'
import { estimateMessageTokens } from '../context/token-estimation'
import {
  COMPACTION_SYSTEM_PROMPT,
  INITIAL_SUMMARIZATION_PROMPT,
  UPDATE_SUMMARIZATION_PROMPT,
  MERGE_SUMMARIES_PROMPT,
  serializeMessages,
  buildToolFailuresSuffix,
} from './prompts'
import { sanitizeString } from '../context/build-context'

interface CompactionParams {
  instanceId: string
  anthropicModel: string
  messages: ReconstructedMessage[]
  keepRecentTokens: number
  previousSummary: string | null
  compactionCount: number
}

interface CompactionResult {
  summary: string
  keptMessageCount: number
  compactedMessageCount: number
}

const ADAPTIVE_CHUNK_THRESHOLD = 100_000
const LARGE_TOOL_RESULT_THRESHOLD = 10_000

export function findCutPoint(
  messages: ReconstructedMessage[],
  keepRecentTokens: number
): number {
  if (messages.length <= 2) return 0

  let accumulatedTokens = 0
  let foundCut = false
  let rawCutIndex = 0

  for (let i = messages.length - 1; i >= 0; i--) {
    accumulatedTokens += estimateMessageTokens(messages[i]!)
    if (accumulatedTokens >= keepRecentTokens) {
      rawCutIndex = i
      foundCut = true
      break
    }
  }

  if (!foundCut) return 0

  for (let i = rawCutIndex; i < messages.length; i++) {
    const msg = messages[i]!
    if (msg.role === 'user' || msg.role === 'assistant') {
      return i
    }
  }

  return 0
}

async function summarize(
  anthropicModel: string,
  conversationText: string,
  previousSummary: string | null
): Promise<string> {
  const modelString = anthropicModel.startsWith('anthropic/')
    ? anthropicModel
    : `anthropic/${anthropicModel}`

  const safeConversation = sanitizeString(conversationText)
  const safePreviousSummary = previousSummary
    ? sanitizeString(previousSummary)
    : null

  let prompt: string
  if (safePreviousSummary) {
    prompt = `<conversation>\n${safeConversation}\n</conversation>\n\n<previous-summary>\n${safePreviousSummary}\n</previous-summary>\n\n${UPDATE_SUMMARIZATION_PROMPT}`
  } else {
    prompt = `<conversation>\n${safeConversation}\n</conversation>\n\n${INITIAL_SUMMARIZATION_PROMPT}`
  }

  const result = await generateText({
    model: modelString,
    system: COMPACTION_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: prompt }],
    maxOutputTokens: 4_000,
  })

  return result.text
}

async function stagedSummarize(
  anthropicModel: string,
  messages: ReconstructedMessage[],
  previousSummary: string | null
): Promise<string> {
  const midpoint = Math.floor(messages.length / 2)
  const firstHalf = messages.slice(0, midpoint)
  const secondHalf = messages.slice(midpoint)

  const firstText = serializeMessages(firstHalf)
  const secondText = serializeMessages(secondHalf)

  const firstSummary = await summarize(
    anthropicModel,
    firstText,
    previousSummary
  )

  const secondSummary = await summarize(
    anthropicModel,
    secondText,
    firstSummary
  )

  const mergeModelString = anthropicModel.startsWith('anthropic/')
    ? anthropicModel
    : `anthropic/${anthropicModel}`
  const mergeResult = await generateText({
    model: mergeModelString,
    system: COMPACTION_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `<summary-1>\n${firstSummary}\n</summary-1>\n\n<summary-2>\n${secondSummary}\n</summary-2>\n\n${MERGE_SUMMARIES_PROMPT}`,
      },
    ],
    maxOutputTokens: 4_000,
  })

  return mergeResult.text
}

function stripLargeToolResults(
  messages: ReconstructedMessage[]
): ReconstructedMessage[] {
  return messages.map((msg) => {
    if (msg.role !== 'tool') return msg
    return {
      ...msg,
      content: msg.content.map((part) => {
        const outputStr = JSON.stringify(part.output)
        if (outputStr.length > LARGE_TOOL_RESULT_THRESHOLD) {
          return {
            ...part,
            output: {
              type: 'text' as const,
              value: '[Large tool result omitted]',
            },
          }
        }
        return part
      }),
    }
  })
}

export async function runCompaction(
  params: CompactionParams
): Promise<CompactionResult | null> {
  const {
    instanceId,
    anthropicModel,
    messages,
    keepRecentTokens,
    previousSummary,
    compactionCount,
  } = params

  const cutIndex = findCutPoint(messages, keepRecentTokens)
  if (cutIndex <= 0) return null

  const messagesToCompact = messages.slice(0, cutIndex)
  const keptMessageCount = messages.length - cutIndex

  let summary: string

  try {
    const conversationText = serializeMessages(messagesToCompact)

    if (conversationText.length > ADAPTIVE_CHUNK_THRESHOLD) {
      summary = await stagedSummarize(
        anthropicModel,
        messagesToCompact,
        previousSummary
      )
    } else {
      summary = await summarize(
        anthropicModel,
        conversationText,
        previousSummary
      )
    }
  } catch {
    try {
      const stripped = stripLargeToolResults(messagesToCompact)
      const strippedText = serializeMessages(stripped)
      summary = await summarize(anthropicModel, strippedText, previousSummary)
    } catch {
      summary = `Conversation covered ${messagesToCompact.length} messages. Summary unavailable due to context limits.`
    }
  }

  const failuresSuffix = buildToolFailuresSuffix(messagesToCompact)
  if (failuresSuffix) {
    summary += failuresSuffix
  }

  const estimatedTokens = Math.ceil(summary.length / 4)

  try {
    await db.composioClawInstance.update({
      where: { id: instanceId, compactionCount },
      data: {
        lastCompactionSummary: summary,
        compactionCount: { increment: 1 },
        lastCompactionAt: new Date(),
        tokensAtCompaction: estimatedTokens,
      },
    })
  } catch {
    return null
  }

  return {
    summary,
    keptMessageCount,
    compactedMessageCount: cutIndex,
  }
}
