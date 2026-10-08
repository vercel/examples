import { generateText } from 'ai'
import { platformModelId, type PlatformId } from '@/lib/platforms'
import { languageModel, transport } from './provider'
import { ANSWER_INSTRUCTIONS, marketInstruction } from './prompts'
import {
  dedupeSources,
  extractUrlsFromText,
  resolveGoogleRedirects,
  sourcesFromTrailingSection,
  type AnswerSource,
} from './sources'
import { platformRequest } from './tools'

export interface QueryInput {
  platform: PlatformId
  question: string
  country: string | null
  language: string | null
  /** Overrides the platform's configured model (Settings → Models). */
  modelId?: string
  timeoutMs?: number
}

export type QueryResult =
  | {
      ok: true
      text: string
      sources: AnswerSource[]
      searchQueries: string[]
      modelId: string
      providerModelId: string | null
      inputTokens: number | null
      outputTokens: number | null
      durationMs: number
    }
  | {
      ok: false
      error: string
      modelId: string
      durationMs: number
    }

export const DEFAULT_QUERY_TIMEOUT_MS = 100_000

/** Asks one AI platform the question the way a user would, with its native web search. */
export async function queryPlatform(input: QueryInput): Promise<QueryResult> {
  const modelId = input.modelId ?? platformModelId(input.platform)
  const started = Date.now()
  try {
    const model = languageModel(modelId)
    const request = platformRequest(input.platform, {
      transport: transport(),
      country: input.country,
    })
    const system = [
      ANSWER_INSTRUCTIONS,
      ...request.instructions,
      marketInstruction({ country: input.country, language: input.language }),
    ]
      .filter((part): part is string => Boolean(part))
      .join('\n\n')
    const prompt = `${input.question.trim()}${request.promptSuffix ?? ''}`

    const result = await generateText({
      model,
      system,
      prompt,
      tools: request.tools,
      toolChoice: request.toolChoice,
      providerOptions: request.providerOptions,
      temperature: 0.2,
      maxOutputTokens: 1200,
      maxRetries: 2,
      abortSignal: AbortSignal.timeout(
        input.timeoutMs ?? DEFAULT_QUERY_TIMEOUT_MS
      ),
    })

    const text = result.text.trim()
    if (!text) {
      return {
        ok: false,
        error: 'The model returned no text.',
        modelId,
        durationMs: Date.now() - started,
      }
    }

    let sources = dedupeSources(
      result.sources
        .filter((source) => source.sourceType === 'url')
        .map((source) => ({ url: source.url, title: source.title ?? null }))
    )
    if (sources.length === 0) {
      sources = dedupeSources(
        [...extractUrlsFromText(text), ...sourcesFromTrailingSection(text)].map(
          (url) => ({ url, title: null })
        )
      )
    }
    if (input.platform === 'gemini') {
      sources = await resolveGoogleRedirects(sources)
    }

    return {
      ok: true,
      text,
      sources,
      searchQueries: collectSearchQueries(result),
      modelId,
      providerModelId: result.response?.modelId ?? null,
      inputTokens: result.usage?.inputTokens ?? null,
      outputTokens: result.usage?.outputTokens ?? null,
      durationMs: Date.now() - started,
    }
  } catch (error) {
    return {
      ok: false,
      error: errorMessage(error),
      modelId,
      durationMs: Date.now() - started,
    }
  }
}

/** Search phrases the platform ran, read from tool calls, tool results and grounding metadata. */
function collectSearchQueries(result: {
  toolCalls: ReadonlyArray<{ input: unknown }>
  toolResults: ReadonlyArray<{ output: unknown }>
  providerMetadata?: unknown
}): string[] {
  const queries = new Set<string>()
  const push = (value: unknown) => {
    if (typeof value === 'string' && value.trim()) queries.add(value.trim())
    else if (Array.isArray(value)) value.forEach(push)
  }
  for (const call of result.toolCalls) {
    const input = asRecord(call.input)
    push(input?.query)
    push(input?.queries)
  }
  for (const toolResult of result.toolResults) {
    const output = asRecord(toolResult.output)
    const action = asRecord(output?.action)
    push(action?.query)
    push(action?.queries)
  }
  walkForSearchQueries(result.providerMetadata, push, 0)
  return Array.from(queries).slice(0, 10)
}

function walkForSearchQueries(
  value: unknown,
  push: (v: unknown) => void,
  depth: number
): void {
  if (depth > 4 || !value || typeof value !== 'object') return
  for (const [key, inner] of Object.entries(value as Record<string, unknown>)) {
    if (key === 'webSearchQueries' || key === 'web_search_queries') push(inner)
    else walkForSearchQueries(inner, push, depth + 1)
  }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null
}

export function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    const cause =
      error.cause instanceof Error ? ` (${error.cause.message})` : ''
    return `${
      error.name === 'AbortError' || error.name === 'TimeoutError'
        ? 'Timed out: '
        : ''
    }${error.message}${cause}`
  }
  return String(error)
}
