import type { ToolSet } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { google } from '@ai-sdk/google'
import { openai } from '@ai-sdk/openai'
import { xai } from '@ai-sdk/xai'
import type { PlatformId } from '@/lib/platforms'
import type { Transport } from './provider'
import { PERPLEXITY_SOURCES_HINT, grokSearchBudgetInstruction } from './prompts'

export interface PlatformRequest {
  tools?: ToolSet
  toolChoice?: 'required'
  providerOptions?: Record<string, Record<string, string[]>>
  /** Extra system instructions for this platform. */
  instructions: string[]
  /** Text appended to the user prompt. */
  promptSuffix?: string
}

/**
 * Each platform's native web search, attached the way the AI SDK expects.
 * Through the gateway the ChatGPT and Grok requests are pinned to their own
 * vendor: other hosts of the same models do not expose the search tools.
 */
export function platformRequest(
  id: PlatformId,
  options: { transport: Transport; country: string | null }
): PlatformRequest {
  const userLocation = options.country
    ? { type: 'approximate' as const, country: options.country.toUpperCase() }
    : undefined
  const viaGateway = options.transport === 'gateway'

  switch (id) {
    case 'chatgpt':
      return {
        tools: {
          web_search: openai.tools.webSearch({
            searchContextSize: 'low',
            ...(userLocation ? { userLocation } : {}),
          }),
        },
        providerOptions: viaGateway
          ? { gateway: { only: ['openai'] } }
          : undefined,
        instructions: [],
      }
    case 'claude':
      return {
        tools: {
          web_search: anthropic.tools.webSearch_20250305({
            maxUses: 1,
            ...(userLocation ? { userLocation } : {}),
          }),
        },
        instructions: [],
      }
    case 'gemini':
      return {
        tools: { google_search: google.tools.googleSearch({}) },
        instructions: [],
      }
    case 'grok':
      return {
        tools: { web_search: xai.tools.webSearch() },
        toolChoice: 'required',
        providerOptions: viaGateway
          ? { gateway: { only: ['xai'] } }
          : undefined,
        instructions: [grokSearchBudgetInstruction(1)],
      }
    case 'perplexity':
      return {
        instructions: [],
        promptSuffix: PERPLEXITY_SOURCES_HINT,
      }
  }
}
