// Adapted from openclaw: src/agents/pi-extensions/context-pruning/pruner.ts:225-346
// Settings from openclaw: src/agents/pi-extensions/context-pruning/settings.ts:48-65
import type { ReconstructedMessage } from '../types'
import { sanitizeString } from './build-context'

const SOFT_TRIM_RATIO = 0.3
const HARD_CLEAR_RATIO = 0.5
const KEEP_LAST_ASSISTANTS = 3
const SOFT_TRIM_MAX_CHARS = 4_000
const SOFT_TRIM_HEAD_CHARS = 1_500
const SOFT_TRIM_TAIL_CHARS = 1_500
const MIN_PRUNABLE_TOOL_CHARS = 50_000
const HARD_CLEAR_PLACEHOLDER = '[Old tool result content cleared]'
const CHARS_PER_TOKEN_ESTIMATE = 4

interface PruneResult {
  messages: ReconstructedMessage[]
  prunedCount: number
}

function estimateMessageChars(msg: ReconstructedMessage): number {
  if (msg.role === 'user') {
    return msg.content.length
  }
  if (msg.role === 'assistant') {
    if (typeof msg.content === 'string') {
      return msg.content.length
    }
    let chars = 0
    for (const part of msg.content) {
      if (part.type === 'text') {
        chars += part.text.length
      } else {
        chars += JSON.stringify(part.input).length + part.toolName.length
      }
    }
    return chars
  }
  // tool message
  let chars = 0
  for (const part of msg.content) {
    chars += JSON.stringify(part.output).length + part.toolName.length
  }
  return chars
}

function deepCloneMessages(
  messages: ReconstructedMessage[]
): ReconstructedMessage[] {
  return structuredClone(messages)
}

function findProtectedBoundary(messages: ReconstructedMessage[]): number {
  let assistantCount = 0
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i]!.role === 'assistant') {
      assistantCount++
      if (assistantCount >= KEEP_LAST_ASSISTANTS) {
        return i
      }
    }
  }
  return 0
}

export function pruneContext(
  messages: ReconstructedMessage[],
  contextWindow: number
): PruneResult {
  const charWindow = contextWindow * CHARS_PER_TOKEN_ESTIMATE
  let totalChars = 0
  for (const msg of messages) {
    totalChars += estimateMessageChars(msg)
  }

  const ratio = totalChars / charWindow

  if (ratio < SOFT_TRIM_RATIO) {
    return { messages, prunedCount: 0 }
  }

  const result = deepCloneMessages(messages)
  let prunedCount = 0

  const protectedBoundary = findProtectedBoundary(result)

  if (ratio >= SOFT_TRIM_RATIO) {
    for (let i = 0; i < protectedBoundary; i++) {
      const msg = result[i]!
      if (msg.role !== 'tool') continue

      for (let j = 0; j < msg.content.length; j++) {
        const part = msg.content[j]!
        const outputStr = JSON.stringify(part.output)

        if (outputStr.length > SOFT_TRIM_MAX_CHARS) {
          const head = outputStr.slice(0, SOFT_TRIM_HEAD_CHARS)
          const tail = outputStr.slice(-SOFT_TRIM_TAIL_CHARS)
          const trimmedChars =
            outputStr.length - SOFT_TRIM_HEAD_CHARS - SOFT_TRIM_TAIL_CHARS

          msg.content[j] = {
            ...part,
            output: {
              type: 'text' as const,
              value: sanitizeString(
                `${head}\n...[trimmed ${trimmedChars} chars]...\n${tail}`
              ),
            },
          }
          prunedCount++
        }
      }
    }

    totalChars = 0
    for (const msg of result) {
      totalChars += estimateMessageChars(msg)
    }
  }

  if (totalChars / charWindow >= HARD_CLEAR_RATIO) {
    for (let i = 0; i < protectedBoundary; i++) {
      if (totalChars / charWindow < HARD_CLEAR_RATIO) break

      const msg = result[i]!
      if (msg.role !== 'tool') continue

      let toolChars = 0
      for (const part of msg.content) {
        toolChars += JSON.stringify(part.output).length
      }

      if (toolChars < MIN_PRUNABLE_TOOL_CHARS) continue

      const charsBefore = estimateMessageChars(msg)
      for (let j = 0; j < msg.content.length; j++) {
        msg.content[j] = {
          ...msg.content[j]!,
          output: { type: 'text' as const, value: HARD_CLEAR_PLACEHOLDER },
        }
      }
      const charsAfter = estimateMessageChars(msg)
      totalChars -= charsBefore - charsAfter
      prunedCount++
    }
  }

  return { messages: result, prunedCount }
}
