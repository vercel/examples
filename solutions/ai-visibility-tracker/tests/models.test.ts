import { describe, expect, it } from 'vitest'
import {
  EXTRACTOR_DEFAULT_MODEL,
  PLATFORMS,
  isModelId,
  resolveModelConfig,
} from '@/lib/platforms'

describe('model configuration', () => {
  it('recognises gateway model ids', () => {
    expect(isModelId('openai/gpt-5.4-nano')).toBe(true)
    expect(isModelId('anthropic/claude-haiku-4.5')).toBe(true)
    expect(isModelId('gpt-5')).toBe(false)
    expect(isModelId('openai/gpt 5')).toBe(false)
  })

  it('prefers stored overrides, ignores invalid ones and falls back to defaults', () => {
    const config = resolveModelConfig({
      chatgpt: 'openai/gpt-5.4',
      gemini: 'not a model',
      extractor: 'openai/gpt-5.4-nano',
    })
    expect(config.platforms.chatgpt).toBe('openai/gpt-5.4')
    expect(config.platforms.gemini).toBe(PLATFORMS.gemini.defaultModel)
    expect(config.platforms.perplexity).toBe(PLATFORMS.perplexity.defaultModel)
    expect(config.extractor).toBe('openai/gpt-5.4-nano')
    expect(resolveModelConfig().extractor).toBe(EXTRACTOR_DEFAULT_MODEL)
  })
})
