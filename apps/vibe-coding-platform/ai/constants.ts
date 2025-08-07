import { type GatewayModelId } from '@ai-sdk/gateway'

export const DEFAULT_MODEL: GatewayModelId[number] = 'openai/gpt-5'

export const SUPPORTED_MODELS: GatewayModelId[] = [
  'amazon/nova-pro',
  'anthropic/claude-4-sonnet',
  'google/gemini-2.5-flash',
  'moonshotai/kimi-k2',
  'openai/gpt-4o',
  'openai/gpt-5',
  'openai/o4-mini',
  'xai/grok-3-fast',
]

export const TEST_PROMPTS = [
  'Generate a Next.js app that allows to list and search Pokemons',
  'Create a `golang` server that responds with "Hello World" to any request',
]
