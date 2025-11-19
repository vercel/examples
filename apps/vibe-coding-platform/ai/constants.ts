import { type GatewayModelId } from '@ai-sdk/gateway'

export enum Models {
  AmazonNovaPro = 'amazon/nova-pro',
  AnthropicClaude4Sonnet = 'anthropic/claude-4-sonnet',
  AnthropicClaude45Sonnet = 'anthropic/claude-sonnet-4.5',
  GoogleGeminiFlash = 'google/gemini-2.5-flash',
  MoonshotKimiK2 = 'moonshotai/kimi-k2',
  OpenAIGPT5 = 'gpt-5',
  XaiGrok3Fast = 'xai/grok-3-fast',
}

export const DEFAULT_MODEL = Models.AnthropicClaude45Sonnet

export const SUPPORTED_MODELS: GatewayModelId[] = [
  Models.AmazonNovaPro,
  Models.AnthropicClaude4Sonnet,
  Models.AnthropicClaude45Sonnet,
  Models.GoogleGeminiFlash,
  Models.MoonshotKimiK2,
  Models.OpenAIGPT5,
  Models.XaiGrok3Fast,
]

export const TEST_PROMPTS = [
  'Generate a Next.js app that allows to list and search Pokemons',
  'Create a `golang` server that responds with "Hello World" to any request',
]
