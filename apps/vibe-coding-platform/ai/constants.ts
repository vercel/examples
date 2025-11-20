import { type GatewayModelId } from '@ai-sdk/gateway'

export enum Models {
  AmazonNovaPro = 'amazon/nova-pro',
  AnthropicClaude4Sonnet = 'anthropic/claude-4-sonnet',
  AnthropicClaude45Haiku = 'anthropic/claude-haiku-4.5',
  AnthropicClaude45Sonnet = 'anthropic/claude-sonnet-4.5',
  GoogleGeminiFlash = 'google/gemini-2.5-flash',
  MoonshotKimiK2 = 'moonshotai/kimi-k2',
  OpenAIGPT5 = 'gpt-5',
  XaiGrok3Fast = 'xai/grok-3-fast',
}

export const DEFAULT_MODEL = Models.AnthropicClaude45Haiku

export const SUPPORTED_MODELS: GatewayModelId[] = [
  Models.AmazonNovaPro,
  Models.AnthropicClaude4Sonnet,
  Models.AnthropicClaude45Haiku,
  Models.AnthropicClaude45Sonnet,
  Models.GoogleGeminiFlash,
  Models.MoonshotKimiK2,
  Models.OpenAIGPT5,
  Models.XaiGrok3Fast,
]

export const TEST_PROMPTS = [
  'Create a react app that allows a user to measure their heart rate by clicking a button in sync with their heartbeat',
  'Sleep for 30 seconds and then return a random sentence. Do not code anything.',
]
