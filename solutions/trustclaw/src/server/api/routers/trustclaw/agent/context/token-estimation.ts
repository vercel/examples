// Token estimation heuristic (chars/4) from pi-mono: packages/coding-agent/src/core/compaction/compaction.ts:225-283
import type { ReconstructedMessage } from '../types'

export interface CompactionSettings {
  contextWindow: number
  reserveTokens: number
  keepRecentTokens: number
}

export const DEFAULT_COMPACTION_SETTINGS: Omit<
  CompactionSettings,
  'contextWindow'
> = {
  reserveTokens: 20_000,
  keepRecentTokens: 20_000,
}

export function estimateMessageTokens(msg: ReconstructedMessage): number {
  if (msg.role === 'user') {
    return Math.ceil(msg.content.length / 4)
  }

  if (msg.role === 'assistant') {
    if (typeof msg.content === 'string') {
      return Math.ceil(msg.content.length / 4)
    }
    let chars = 0
    for (const part of msg.content) {
      if (part.type === 'text') {
        chars += part.text.length
      } else {
        chars += JSON.stringify(part.input).length
        chars += part.toolName.length
      }
    }
    return Math.ceil(chars / 4)
  }

  let chars = 0
  for (const part of msg.content) {
    chars += JSON.stringify(part.output).length
    chars += part.toolName.length
  }
  return Math.ceil(chars / 4)
}

export function calculateContextTokens(usage: {
  inputTokens: number
  outputTokens: number
  totalTokens: number
}): number {
  return usage.totalTokens || usage.inputTokens + usage.outputTokens
}

export function estimateContextTokens(
  messages: ReconstructedMessage[],
  systemPromptTokens: number,
  lastUsage?: {
    inputTokens: number
    outputTokens: number
    totalTokens: number
  }
): number {
  if (lastUsage) {
    return calculateContextTokens(lastUsage)
  }

  let total = systemPromptTokens
  for (const msg of messages) {
    total += estimateMessageTokens(msg)
  }
  return total
}

export function shouldCompact(
  contextTokens: number,
  settings: CompactionSettings
): boolean {
  return contextTokens > settings.contextWindow - settings.reserveTokens
}

export const FLUSH_SOFT_TOKENS = 4_000

export function shouldFlushMemory(
  contextTokens: number,
  settings: CompactionSettings,
  compactionCount: number,
  memoryFlushCount: number
): boolean {
  const flushThreshold =
    settings.contextWindow - settings.reserveTokens - FLUSH_SOFT_TOKENS
  return contextTokens >= flushThreshold && memoryFlushCount <= compactionCount
}
