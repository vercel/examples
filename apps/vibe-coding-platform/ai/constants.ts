import { type GatewayModelId } from '@ai-sdk/gateway'

export enum Models {
  AmazonNova2Pro = 'amazon/nova-2-pro',
  AnthropicClaudeSonnet46 = 'anthropic/claude-sonnet-4.6',
  AnthropicClaudeOpus46 = 'anthropic/claude-opus-4.6',
  GoogleGemini3Flash = 'google/gemini-3-flash',
  MoonshotKimiK25 = 'moonshotai/kimi-k2.5',
  OpenAIGPT52 = 'openai/gpt-5.2',
  XaiGrok41Fast = 'xai/grok-4.1-fast-non-reasoning',
}

export const DEFAULT_MODEL = Models.OpenAIGPT52

export const SUPPORTED_MODELS: GatewayModelId[] = [
  Models.OpenAIGPT52,
  Models.AmazonNova2Pro,
  Models.AnthropicClaudeSonnet46,
  Models.AnthropicClaudeOpus46,
  Models.GoogleGemini3Flash,
  Models.MoonshotKimiK25,
  Models.XaiGrok41Fast,
]

export const TEST_PROMPTS = [
  'Generate a Next.js app that allows to list and search Pokemons',
  'Create a `golang` server that responds with "Hello World" to any request',
]
