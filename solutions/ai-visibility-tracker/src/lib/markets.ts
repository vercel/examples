export interface MarketOption {
  code: string
  name: string
}

/** ISO 3166-1 alpha-2 codes, lowercase. */
export const COUNTRIES: MarketOption[] = [
  { code: 'us', name: 'United States' },
  { code: 'gb', name: 'United Kingdom' },
  { code: 'ca', name: 'Canada' },
  { code: 'au', name: 'Australia' },
  { code: 'de', name: 'Germany' },
  { code: 'fr', name: 'France' },
  { code: 'es', name: 'Spain' },
  { code: 'it', name: 'Italy' },
  { code: 'nl', name: 'Netherlands' },
  { code: 'be', name: 'Belgium' },
  { code: 'ch', name: 'Switzerland' },
  { code: 'at', name: 'Austria' },
  { code: 'se', name: 'Sweden' },
  { code: 'no', name: 'Norway' },
  { code: 'dk', name: 'Denmark' },
  { code: 'fi', name: 'Finland' },
  { code: 'ie', name: 'Ireland' },
  { code: 'pt', name: 'Portugal' },
  { code: 'pl', name: 'Poland' },
  { code: 'cz', name: 'Czechia' },
  { code: 'ro', name: 'Romania' },
  { code: 'gr', name: 'Greece' },
  { code: 'tr', name: 'Türkiye' },
  { code: 'ua', name: 'Ukraine' },
  { code: 'il', name: 'Israel' },
  { code: 'ae', name: 'United Arab Emirates' },
  { code: 'sa', name: 'Saudi Arabia' },
  { code: 'za', name: 'South Africa' },
  { code: 'in', name: 'India' },
  { code: 'sg', name: 'Singapore' },
  { code: 'jp', name: 'Japan' },
  { code: 'kr', name: 'South Korea' },
  { code: 'id', name: 'Indonesia' },
  { code: 'ph', name: 'Philippines' },
  { code: 'th', name: 'Thailand' },
  { code: 'vn', name: 'Vietnam' },
  { code: 'nz', name: 'New Zealand' },
  { code: 'mx', name: 'Mexico' },
  { code: 'br', name: 'Brazil' },
  { code: 'ar', name: 'Argentina' },
  { code: 'cl', name: 'Chile' },
  { code: 'co', name: 'Colombia' },
]

/** ISO 639-1 codes, lowercase. */
export const LANGUAGES: MarketOption[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'de', name: 'German' },
  { code: 'fr', name: 'French' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'nl', name: 'Dutch' },
  { code: 'sv', name: 'Swedish' },
  { code: 'no', name: 'Norwegian' },
  { code: 'da', name: 'Danish' },
  { code: 'fi', name: 'Finnish' },
  { code: 'pl', name: 'Polish' },
  { code: 'cs', name: 'Czech' },
  { code: 'ro', name: 'Romanian' },
  { code: 'el', name: 'Greek' },
  { code: 'tr', name: 'Turkish' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'ru', name: 'Russian' },
  { code: 'he', name: 'Hebrew' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'id', name: 'Indonesian' },
  { code: 'th', name: 'Thai' },
  { code: 'vi', name: 'Vietnamese' },
]

export function countryName(code: string | null | undefined): string | null {
  if (!code) return null
  return (
    COUNTRIES.find((c) => c.code === code.toLowerCase())?.name ??
    code.toUpperCase()
  )
}

export function languageName(code: string | null | undefined): string | null {
  if (!code) return null
  return LANGUAGES.find((l) => l.code === code.toLowerCase())?.name ?? code
}

export function isCountryCode(value: unknown): value is string {
  return typeof value === 'string' && COUNTRIES.some((c) => c.code === value)
}

export function isLanguageCode(value: unknown): value is string {
  return typeof value === 'string' && LANGUAGES.some((l) => l.code === value)
}

export function marketLabel(market: {
  country: string | null
  language: string | null
}): string {
  const parts = [
    countryName(market.country),
    languageName(market.language),
  ].filter(Boolean)
  return parts.length ? parts.join(' · ') : 'Global'
}
