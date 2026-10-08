export const PLATFORM_IDS = [
  'chatgpt',
  'perplexity',
  'gemini',
  'claude',
  'grok',
] as const
export type PlatformId = (typeof PLATFORM_IDS)[number]

export interface PlatformDefinition {
  id: PlatformId
  label: string
  /** Gateway model id (`creator/model`). Override with the env variable in `modelEnv`. */
  defaultModel: string
  modelEnv: string
  description: string
}

export const PLATFORMS: Record<PlatformId, PlatformDefinition> = {
  chatgpt: {
    id: 'chatgpt',
    label: 'ChatGPT',
    defaultModel: 'openai/gpt-5.4-nano',
    modelEnv: 'MODEL_CHATGPT',
    description: 'OpenAI model answering with the web_search tool.',
  },
  perplexity: {
    id: 'perplexity',
    label: 'Perplexity',
    defaultModel: 'perplexity/sonar',
    modelEnv: 'MODEL_PERPLEXITY',
    description: 'Perplexity Sonar, a search-native model.',
  },
  gemini: {
    id: 'gemini',
    label: 'Gemini',
    defaultModel: 'google/gemini-3-flash',
    modelEnv: 'MODEL_GEMINI',
    description: 'Gemini grounded with Google Search.',
  },
  claude: {
    id: 'claude',
    label: 'Claude',
    defaultModel: 'anthropic/claude-haiku-4.5',
    modelEnv: 'MODEL_CLAUDE',
    description: 'Claude with the web search tool, one search per answer.',
  },
  grok: {
    id: 'grok',
    label: 'Grok',
    defaultModel: 'xai/grok-4.20-non-reasoning',
    modelEnv: 'MODEL_GROK',
    description: 'Grok with xAI web search, budgeted to one search per answer.',
  },
}

export const DEFAULT_PLATFORMS: PlatformId[] = [
  'chatgpt',
  'perplexity',
  'gemini',
]

export const EXTRACTOR_DEFAULT_MODEL = 'openai/gpt-4o-mini'

export function isPlatformId(value: unknown): value is PlatformId {
  return (
    typeof value === 'string' &&
    (PLATFORM_IDS as readonly string[]).includes(value)
  )
}

/** Model behind a platform from the environment or the built-in default (no database involved). */
export function platformModelId(id: PlatformId): string {
  const override = process.env[PLATFORMS[id].modelEnv]?.trim()
  return override || PLATFORMS[id].defaultModel
}

export function extractorModelId(): string {
  return process.env.MODEL_EXTRACTOR?.trim() || EXTRACTOR_DEFAULT_MODEL
}

export const EXTRACTOR_KEY = 'extractor'

export interface ModelConfig {
  platforms: Record<PlatformId, string>
  extractor: string
}

/** Looks like a gateway model id: `creator/model`, no spaces. */
export function isModelId(value: string): boolean {
  return /^[a-z0-9][a-z0-9._-]*\/[A-Za-z0-9][A-Za-z0-9._:-]*$/i.test(
    value.trim()
  )
}

/**
 * Effective model per platform: stored overrides first (the Settings page),
 * then environment variables, then the built-in defaults.
 */
export function resolveModelConfig(
  overrides: Record<string, string> = {}
): ModelConfig {
  const pick = (key: string, fallback: string) => {
    const value = overrides[key]?.trim()
    return value && isModelId(value) ? value : fallback
  }
  const platforms = Object.fromEntries(
    PLATFORM_IDS.map((id) => [id, pick(id, platformModelId(id))])
  ) as Record<PlatformId, string>
  return { platforms, extractor: pick(EXTRACTOR_KEY, extractorModelId()) }
}

export function platformLabel(id: string): string {
  return isPlatformId(id) ? PLATFORMS[id].label : id
}

/** Keeps only known platform ids, in canonical order. */
export function normalizePlatformList(values: unknown): PlatformId[] {
  const set = new Set(Array.isArray(values) ? values.filter(isPlatformId) : [])
  return PLATFORM_IDS.filter((id) => set.has(id))
}
