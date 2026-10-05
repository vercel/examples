import { type GatewayModelId } from '@ai-sdk/gateway'

export enum Models {
  AnthropicClaudeOpus55 = 'anthropic/claude-opus-5.5',
  AnthropicClaudeSonnet55 = 'anthropic/claude-sonnet-5.5',
  OpenAIGPT61Sol = 'openai/gpt-6.1-sol',
  SpaceXAIGrok47 = 'spacexai/grok-4.7',
}

export const DEFAULT_MODEL = Models.AnthropicClaudeOpus55

export const SUPPORTED_MODELS: GatewayModelId[] = [
  Models.AnthropicClaudeOpus55,
  Models.AnthropicClaudeSonnet55,
  Models.OpenAIGPT61Sol,
  Models.SpaceXAIGrok47,
]

export const MODEL_NAMES: Record<string, string> = {
  [Models.AnthropicClaudeOpus55]: 'Claude Opus 5.5',
  [Models.AnthropicClaudeSonnet55]: 'Claude Sonnet 5.5',
  [Models.OpenAIGPT61Sol]: 'GPT-6.1 Sol',
  [Models.SpaceXAIGrok47]: 'Grok 4.7',
}

export const TEST_PROMPTS = [
  'Generate a Next.js app that allows to list and search Pokemons',
  'Create a `golang` server that responds with "Hello World" to any request',
]
