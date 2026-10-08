import type { AnswerSource } from '@/lib/db/schema'

export type { AnswerSource }

const GOOGLE_REDIRECT_HOST = 'vertexaisearch.cloud.google.com'
const GOOGLE_REDIRECT_PATH = '/grounding-api-redirect/'
const TRAILING_PUNCTUATION = /[.,;:!?)\]}'"»”]+$/

/** Canonical form used for deduplication: http(s) only, no fragment, no trailing slash. */
export function normalizeUrl(raw: string): string | null {
  const candidate = raw.trim().replace(TRAILING_PUNCTUATION, '')
  if (!candidate) return null
  let url: URL
  try {
    url = new URL(candidate)
  } catch {
    return null
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
  url.hash = ''
  url.hostname = url.hostname.toLowerCase()
  if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
    url.pathname = url.pathname.slice(0, -1)
  }
  return url.toString()
}

export function dedupeSources(sources: AnswerSource[]): AnswerSource[] {
  const seen = new Map<string, AnswerSource>()
  for (const source of sources) {
    const url = normalizeUrl(source.url)
    if (!url) continue
    const existing = seen.get(url)
    if (!existing) {
      seen.set(url, { url, title: source.title?.trim() || null })
    } else if (!existing.title && source.title) {
      existing.title = source.title.trim() || null
    }
  }
  return Array.from(seen.values())
}

export function isGoogleRedirect(url: string): boolean {
  try {
    const parsed = new URL(url)
    return (
      parsed.protocol === 'https:' &&
      parsed.hostname.toLowerCase() === GOOGLE_REDIRECT_HOST &&
      parsed.pathname.startsWith(GOOGLE_REDIRECT_PATH)
    )
  } catch {
    return false
  }
}

/**
 * Gemini grounding returns opaque redirect URLs. Resolving them keeps the
 * domain statistics meaningful. Only Google's exact redirect endpoint is ever
 * contacted, because citation URLs are provider-controlled input.
 */
export async function resolveGoogleRedirects(
  sources: AnswerSource[],
  options: { fetchImpl?: typeof fetch; timeoutMs?: number } = {}
): Promise<AnswerSource[]> {
  const fetchImpl = options.fetchImpl ?? fetch
  const timeoutMs = options.timeoutMs ?? 5_000
  const resolved = await Promise.all(
    sources.map(async (source) => {
      if (!isGoogleRedirect(source.url)) return source
      const location = await redirectLocation(source.url, fetchImpl, timeoutMs)
      const normalized = location ? normalizeUrl(location) : null
      return normalized ? { ...source, url: normalized } : source
    })
  )
  return dedupeSources(resolved)
}

async function redirectLocation(
  url: string,
  fetchImpl: typeof fetch,
  timeoutMs: number
): Promise<string | null> {
  for (const method of ['HEAD', 'GET'] as const) {
    try {
      const response = await fetchImpl(url, {
        method,
        redirect: 'manual',
        signal: AbortSignal.timeout(timeoutMs),
      })
      const location = response.headers.get('location')
      if (location) {
        try {
          return new URL(location, url).toString()
        } catch {
          return null
        }
      }
    } catch {
      // fall through to the next method
    }
  }
  return null
}

const MARKDOWN_LINK = /\[[^\]]*\]\((https?:\/\/[^\s)]+)\)/gi
const BARE_URL = /https?:\/\/[^\s<>()\[\]"']+/gi

/** URLs written in the answer itself (markdown links and bare links). */
export function extractUrlsFromText(text: string): string[] {
  const found: string[] = []
  for (const match of text.matchAll(MARKDOWN_LINK)) found.push(match[1])
  for (const match of text.matchAll(BARE_URL)) found.push(match[0])
  const unique = new Set<string>()
  for (const raw of found) {
    const url = normalizeUrl(raw)
    if (url) unique.add(url)
  }
  return Array.from(unique)
}

const TRAILING_SECTION =
  /(?:^|\n)\s*(?:\*\*|#+\s*)?(?:sources?|citations?|references?)\s*:?\s*(?:\*\*)?\s*\n([\s\S]*)$/i
const BARE_DOMAIN =
  /(?:^|[\s([{<*\-•]|\d+\.)\s*((?:www\.)?[a-z0-9][-a-z0-9]*(?:\.[a-z0-9][-a-z0-9]*)+(?:\/[^\s)\]}>"',;:!?]*)?)/gi

/**
 * Perplexity-style answers end with a "Sources" list that may contain bare
 * domains without a scheme. Returns the full URLs found in that section.
 */
export function sourcesFromTrailingSection(text: string): string[] {
  const match = TRAILING_SECTION.exec(text)
  const body = match?.[1]
  if (!body?.trim()) return []
  const urls = new Set(extractUrlsFromText(body))
  for (const found of body.matchAll(BARE_DOMAIN)) {
    const candidate = found[1].replace(TRAILING_PUNCTUATION, '')
    if (/^https?:\/\//i.test(candidate)) continue
    const url = normalizeUrl(`https://${candidate}`)
    if (url) urls.add(url)
  }
  return Array.from(urls)
}
