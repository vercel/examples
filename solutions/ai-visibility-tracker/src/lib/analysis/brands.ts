/**
 * Brand identity helpers. One brand must occupy one row of the report even
 * when answers spell it differently ("Otterly.ai", "OtterlyAI", "Otterly").
 */
const GENERIC_NAMES = new Set([
  'ai',
  'seo',
  'tool',
  'tools',
  'software',
  'platform',
  'service',
  'services',
  'analytics',
  'search',
  'marketing',
  'content',
  'assistant',
  'app',
  'apps',
  'website',
  'brand',
  'company',
  'product',
  'solution',
  'agency',
  'none',
  'n/a',
  'unknown',
])

const DROPPED_TOKENS = new Set([
  'the',
  'inc',
  'llc',
  'ltd',
  'co',
  'corp',
  'corporation',
  'company',
  'gmbh',
  'plc',
  'sa',
  'srl',
  'bv',
  'oy',
  'ab',
  'ag',
  'kg',
  'app',
  'ai',
  'io',
  'hq',
  'platform',
  'software',
  'official',
  'tool',
  'tools',
])

const STRIPPED_SUFFIXES = ['ai', 'io', 'app', 'hq']

export function isGenericBrandName(name: string): boolean {
  const normalized = name.trim().toLowerCase()
  if (normalized.length <= 2) return true
  return GENERIC_NAMES.has(normalized)
}

/** Lowercase alphanumeric key shared by all spellings of a brand. */
export function canonicalBrandKey(name: string): string {
  const tokens = name
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (tokens.length === 0) return ''

  const kept = tokens.filter((token) => !DROPPED_TOKENS.has(token))
  const base = (kept.length > 0 ? kept : tokens).join('')
  for (const suffix of STRIPPED_SUFFIXES) {
    if (
      base.endsWith(suffix) &&
      base.length - suffix.length >= 3 &&
      kept.length === 1
    ) {
      return base.slice(0, -suffix.length)
    }
  }
  return base
}

const SECOND_LEVEL_LABELS = new Set([
  'co',
  'com',
  'org',
  'net',
  'ac',
  'gov',
  'edu',
  'or',
  'ne',
])

/** Registrable label of a domain: "brand" in brand.com, brand.co.uk or shop.brand.de. */
export function domainRoot(domain: string): string {
  const labels = domain.toLowerCase().split('.').filter(Boolean)
  if (labels.length <= 1) return labels[0] ?? ''
  if (
    labels.length >= 3 &&
    SECOND_LEVEL_LABELS.has(labels[labels.length - 2])
  ) {
    return labels[labels.length - 3]
  }
  return labels[labels.length - 2]
}

/** A domain is only attributed to a brand when its root and the brand key overlap. */
export function domainBelongsToBrand(
  domain: string,
  brandKey: string
): boolean {
  const root = domainRoot(domain).replace(/[^a-z0-9]/g, '')
  if (root.length < 3 || brandKey.length < 3) return false
  return root.includes(brandKey) || brandKey.includes(root)
}
