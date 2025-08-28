import type { JSONValue } from 'ai'
import type { OpenAIResponsesProviderOptions } from '@ai-sdk/openai'
import { createGatewayProvider, type GatewayModelId } from '@ai-sdk/gateway'

const gateway = createGatewayProvider({
  baseURL: process.env.AI_GATEWAY_BASE_URL,
})

interface AvailableModel {
  id: GatewayModelId | 'openai/gpt-5'
  name: string
}

export async function getAvailableModels(): Promise<AvailableModel[]> {
  const response = await gateway.getAvailableModels()
  return [...response.models.map(({ id, name }) => ({ id, name }))]
}

interface ModelOptions {
  model: string
  providerOptions?: Record<string, Record<string, JSONValue>>
  headers?: Record<string, string>
}

export function getModelOptions(modelId: string): ModelOptions {
  if (modelId === 'openai/o4-mini') {
    return {
      model: modelId,
      providerOptions: {
        openai: {
          reasoningEffort: 'low',
          reasoningSummary: 'detailed',
        } satisfies OpenAIResponsesProviderOptions,
      },
    }
  }

  if (modelId === 'openai/gpt-5') {
    return {
      model: modelId,
      providerOptions: {
        openai: {
          include: ['reasoning.encrypted_content'],
          reasoningEffort: 'low',
          reasoningSummary: 'detailed',
        } satisfies OpenAIResponsesProviderOptions,
      },
    }
  }

  if (modelId === 'anthropic/claude-4-sonnet') {
    return {
      model: modelId,
      headers: { 'anthropic-beta': 'fine-grained-tool-streaming-2025-05-14' },
      providerOptions: {
        // gateway: { order: ["bedrock", "vertex"] },
        anthropic: {
          cacheControl: { type: 'ephemeral' },
        },
      },
    }
  }

  return {
    model: modelId,
  }
}
