/**
 * Deterministic text analysis. Whether the tracked brand appears in an answer
 * is decided by text matching, never by a model, so every number in the
 * report can be reproduced from the stored answer.
 */

export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Word-boundary-aware pattern that also works for names starting or ending in punctuation (C++, .NET, monday.com). */
export function mentionPattern(name: string): RegExp | null {
  const trimmed = name.trim()
  if (!trimmed) return null
  return new RegExp(
    `(?<![\\p{L}\\p{N}])${escapeRegExp(trimmed)}(?![\\p{L}\\p{N}])`,
    'giu'
  )
}

export interface MentionResult {
  count: number
  firstIndex: number | null
}

export function findMentions(text: string, names: string[]): MentionResult {
  let count = 0
  let firstIndex: number | null = null
  for (const name of names) {
    const pattern = mentionPattern(name)
    if (!pattern) continue
    for (const match of text.matchAll(pattern)) {
      count += 1
      if (firstIndex === null || match.index < firstIndex)
        firstIndex = match.index
    }
  }
  return { count, firstIndex }
}

/** Lowercase host without scheme, credentials, www., port or path. */
export function normalizeDomain(input: string): string {
  let value = input.trim().toLowerCase()
  if (!value) return ''
  if (!/^[a-z][a-z0-9+.-]*:\/\//.test(value)) value = `https://${value}`
  try {
    const host = new URL(value).hostname
    return host.replace(/^www\./, '').replace(/\.$/, '')
  } catch {
    return input
      .trim()
      .toLowerCase()
      .replace(/^[a-z]+:\/\//, '')
      .replace(/^www\./, '')
      .split(/[/?#:]/)[0]
  }
}

export function hostOf(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, '')
  } catch {
    return null
  }
}

export function hostMatchesDomain(host: string, domain: string): boolean {
  if (!host || !domain) return false
  return host === domain || host.endsWith(`.${domain}`)
}

export interface CitationResult {
  cited: boolean
  url: string | null
}

/** The tracked website counts as cited when a source or a link in the text points at it. */
export function detectCitation(
  text: string,
  sources: ReadonlyArray<{ url: string }>,
  domainInput: string
): CitationResult {
  const domain = normalizeDomain(domainInput)
  if (!domain) return { cited: false, url: null }

  for (const source of sources) {
    const host = hostOf(source.url)
    if (host && hostMatchesDomain(host, domain))
      return { cited: true, url: source.url }
  }

  const urlPattern = new RegExp(
    `https?://(?:[a-z0-9-]+\\.)*${escapeRegExp(domain)}(?:/[^\\s)\\]}>"']*)?`,
    'i'
  )
  const urlMatch = urlPattern.exec(text)
  if (urlMatch)
    return { cited: true, url: urlMatch[0].replace(/[.,;:!?]+$/, '') }

  const bare = new RegExp(
    `(?<![a-z0-9.-])(?:www\\.)?${escapeRegExp(domain)}(?![a-z0-9-])`,
    'i'
  )
  if (bare.test(text)) return { cited: true, url: `https://${domain}` }

  return { cited: false, url: null }
}

export interface RankEntry {
  key: string
  names: string[]
}

/** 1-based order in which brands first appear in the answer. Brands not found are absent. */
export function rankBrands(
  text: string,
  entries: RankEntry[]
): Map<string, number> {
  const firstIndexByKey = new Map<string, number>()
  for (const entry of entries) {
    const { firstIndex } = findMentions(text, entry.names)
    if (firstIndex === null) continue
    const current = firstIndexByKey.get(entry.key)
    if (current === undefined || firstIndex < current)
      firstIndexByKey.set(entry.key, firstIndex)
  }
  const ordered = Array.from(firstIndexByKey.entries()).sort(
    (a, b) => a[1] - b[1]
  )
  return new Map(ordered.map(([key], index) => [key, index + 1]))
}
