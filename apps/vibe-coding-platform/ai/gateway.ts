import { createGatewayProvider } from '@ai-sdk/gateway'
import { Models } from './constants'
import type { JSONValue } from 'ai'
import type { OpenAIResponsesProviderOptions } from '@ai-sdk/openai'
import type { LanguageModelV2 } from '@ai-sdk/provider'

export async function getAvailableModels() {
  const gateway = gatewayInstance()
  const response = await gateway.getAvailableModels()
  return response.models
    .map((model) => ({ id: model.id, name: model.name }))
    .concat([{ id: Models.OpenAIGPT5, name: 'GPT-5' }])
}

export interface ModelOptions {
  model: LanguageModelV2
  providerOptions?: Record<string, Record<string, JSONValue>>
  headers?: Record<string, string>
}

export function getModelOptions(
  modelId: string,
  options?: { reasoningEffort?: 'minimal' | 'low' | 'medium' }
): ModelOptions {
  const gateway = gatewayInstance()
  if (modelId === Models.OpenAIGPT5) {
    return {
      model: gateway(modelId),
      providerOptions: {
        openai: {
          include: ['reasoning.encrypted_content'],
          reasoningEffort: options?.reasoningEffort ?? 'low',
          reasoningSummary: 'auto',
          serviceTier: 'priority',
        } satisfies OpenAIResponsesProviderOptions,
      },
    }
  }

  if (modelId === Models.AnthropicClaude4Sonnet) {
    return {
      model: gateway(modelId),
      headers: { 'anthropic-beta': 'fine-grained-tool-streaming-2025-05-14' },
      providerOptions: {
        anthropic: {
          cacheControl: { type: 'ephemeral' },
        },
      },
    }
  }

  return {
    model: gateway(modelId),
  }
}

function gatewayInstance() {
  return createGatewayProvider({
    baseURL: process.env.AI_GATEWAY_BASE_URL,
  })
}
