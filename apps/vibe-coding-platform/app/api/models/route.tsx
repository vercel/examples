import { SUPPORTED_MODELS, Models } from '@/ai/constants'
import { NextResponse } from 'next/server'

// Model display names mapping
const MODEL_NAMES: Record<string, string> = {
  [Models.OpenAIGPT52]: 'GPT-5.2',
  [Models.AmazonNovaPro]: 'Amazon Nova Pro',
  [Models.AnthropicClaude4Sonnet]: 'Claude 4 Sonnet',
  [Models.AnthropicClaude45Sonnet]: 'Claude 4.5 Sonnet',
  [Models.GoogleGeminiFlash]: 'Gemini 2.5 Flash',
  [Models.MoonshotKimiK2]: 'Kimi K2',
  [Models.XaiGrok3Fast]: 'Grok 3 Fast',
}

export async function GET() {
  // Return models directly from constants - no gateway API call needed
  const models = SUPPORTED_MODELS.map((id) => ({
    id,
    name: MODEL_NAMES[id] || id,
  }))

  return NextResponse.json({ models })
}
