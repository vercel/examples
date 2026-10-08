import { Output, generateText } from 'ai'
import { z } from 'zod'
import {
  canonicalBrandKey,
  domainBelongsToBrand,
  isGenericBrandName,
} from '@/lib/analysis/brands'
import { normalizeDomain } from '@/lib/analysis/mentions'
import { extractorModelId } from '@/lib/platforms'
import type { Sentiment } from '@/lib/db/schema'
import { languageModel } from './provider'
import { extractionPrompt } from './prompts'

const sentimentSchema = z.enum(['positive', 'neutral', 'negative'])

export const extractionSchema = z.object({
  brands: z.array(
    z.object({
      name: z.string().describe('Canonical brand or product name.'),
      matched_names: z
        .array(z.string())
        .describe('Exact spellings of the brand copied from the answer text.'),
      website: z
        .string()
        .nullable()
        .describe(
          'Official domain of the brand when highly confident, otherwise null.'
        ),
      sentiment: sentimentSchema.describe('How the answer presents the brand.'),
      recommended: z
        .boolean()
        .describe(
          'True when the answer recommends the brand or ranks it as a top option.'
        ),
      is_competitor: z
        .boolean()
        .describe(
          'True when a user asking this question could choose the brand instead of the monitored brand: an alternative product, service or provider for the same need. Always false for the monitored brand.'
        ),
      highlights: z
        .array(z.string())
        .describe(
          'Up to three concise statements the answer makes about the brand.'
        ),
    })
  ),
})

export type RawExtractedBrand = z.infer<
  typeof extractionSchema
>['brands'][number]

export interface ExtractedBrand {
  name: string
  key: string
  matchedNames: string[]
  website: string | null
  sentiment: Sentiment
  recommended: boolean
  isCompetitor: boolean
  isSelf: boolean
  highlights: string[]
}

export interface ExtractInput {
  question: string
  answerText: string
  citations: string[]
  brandName: string
  brandAliases: string[]
  brandDomain: string
  /** Overrides the configured extractor model (Settings → Models). */
  modelId?: string
  timeoutMs?: number
}

export const DEFAULT_EXTRACT_TIMEOUT_MS = 45_000

/** One structured-output call that names every brand in the answer and what was said about it. */
export async function extractBrands(
  input: ExtractInput
): Promise<ExtractedBrand[]> {
  const model = languageModel(input.modelId ?? extractorModelId())
  const { output } = await generateText({
    model,
    output: Output.object({ schema: extractionSchema }),
    prompt: extractionPrompt({
      question: input.question,
      answerText: input.answerText,
      citations: input.citations,
      brandName: input.brandName,
      brandDomain: input.brandDomain,
    }),
    temperature: 0.2,
    maxOutputTokens: 3000,
    maxRetries: 2,
    abortSignal: AbortSignal.timeout(
      input.timeoutMs ?? DEFAULT_EXTRACT_TIMEOUT_MS
    ),
  })
  return normalizeExtractedBrands(output?.brands ?? [], input)
}

/** Pure post-processing: drops generic names, merges spellings, validates websites, flags the tracked brand. */
export function normalizeExtractedBrands(
  rows: RawExtractedBrand[],
  input: Pick<ExtractInput, 'brandName' | 'brandAliases' | 'brandDomain'>
): ExtractedBrand[] {
  const selfKeys = new Set(
    [input.brandName, ...input.brandAliases]
      .map(canonicalBrandKey)
      .filter((key) => key.length > 0)
  )
  const selfDomain = normalizeDomain(input.brandDomain)
  const byKey = new Map<string, ExtractedBrand>()

  for (const row of rows) {
    const name = row.name.trim()
    if (!name || isGenericBrandName(name)) continue
    const key = canonicalBrandKey(name)
    if (!key) continue

    const website = cleanWebsite(row.website, key)
    const isSelf =
      selfKeys.has(key) || (website !== null && website === selfDomain)
    const matchedNames = uniqueStrings(
      [...row.matched_names, name].map((n) => n.trim()).filter(Boolean)
    )
    const highlights = uniqueStrings(
      row.highlights.map((h) => h.trim()).filter(Boolean)
    ).slice(0, 3)

    const existing = byKey.get(key)
    if (existing) {
      existing.matchedNames = uniqueStrings([
        ...existing.matchedNames,
        ...matchedNames,
      ])
      existing.highlights = uniqueStrings([
        ...existing.highlights,
        ...highlights,
      ]).slice(0, 3)
      existing.website = existing.website ?? website
      existing.recommended = existing.recommended || row.recommended
      existing.isCompetitor =
        existing.isCompetitor ||
        (!isSelf && (row.is_competitor || row.recommended))
      continue
    }

    // A brand the answer recommends for the user's need is an alternative by
    // definition, whatever the extractor decided about the competitor flag.
    byKey.set(key, {
      name,
      key,
      matchedNames,
      website,
      sentiment: row.sentiment,
      recommended: row.recommended,
      isCompetitor: isSelf ? false : row.is_competitor || row.recommended,
      isSelf,
      highlights,
    })
  }

  return Array.from(byKey.values())
}

function cleanWebsite(raw: string | null, brandKey: string): string | null {
  if (!raw) return null
  const domain = normalizeDomain(raw)
  if (!domain || !domain.includes('.')) return null
  return domainBelongsToBrand(domain, brandKey) ? domain : null
}

function uniqueStrings(values: string[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const value of values) {
    const lower = value.toLowerCase()
    if (seen.has(lower)) continue
    seen.add(lower)
    out.push(value)
  }
  return out
}
