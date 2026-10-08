import { describe, expect, it } from 'vitest'
import {
  canonicalBrandKey,
  domainBelongsToBrand,
  domainRoot,
  isGenericBrandName,
} from '@/lib/analysis/brands'
import { normalizeExtractedBrands } from '@/lib/ai/extract'

describe('canonicalBrandKey', () => {
  it('collapses spellings of the same brand', () => {
    expect(canonicalBrandKey('Otterly.ai')).toBe('otterly')
    expect(canonicalBrandKey('OtterlyAI')).toBe('otterly')
    expect(canonicalBrandKey('Otterly')).toBe('otterly')
    expect(canonicalBrandKey('Otterly AI Inc.')).toBe('otterly')
  })

  it('keeps distinct brands distinct', () => {
    expect(canonicalBrandKey('Ahrefs')).not.toBe(
      canonicalBrandKey('Ahrefs Brand Radar')
    )
    expect(canonicalBrandKey('Semrush')).toBe('semrush')
  })

  it('drops accents and punctuation', () => {
    expect(canonicalBrandKey('Café Noir')).toBe('cafenoir')
  })
})

describe('isGenericBrandName', () => {
  it('rejects generic terms and tiny names', () => {
    expect(isGenericBrandName('AI')).toBe(true)
    expect(isGenericBrandName('Software')).toBe(true)
    expect(isGenericBrandName('HubSpot')).toBe(false)
  })
})

describe('domainBelongsToBrand', () => {
  it('accepts a domain whose root overlaps the brand key', () => {
    expect(domainRoot('www.semrush.com')).toBe('semrush')
    expect(domainRoot('shop.brand.co.uk')).toBe('brand')
    expect(domainBelongsToBrand('semrush.com', 'semrush')).toBe(true)
    expect(domainBelongsToBrand('behindrankings.com', 'seranking')).toBe(false)
  })
})

describe('normalizeExtractedBrands', () => {
  const input = {
    brandName: 'Searcherries',
    brandAliases: ['Searcherries AI'],
    brandDomain: 'searcherries.com',
  }

  it('merges spellings, drops generic names and validates websites', () => {
    const rows = normalizeExtractedBrands(
      [
        {
          name: 'Otterly.ai',
          matched_names: ['Otterly.ai'],
          website: 'otterly.ai',
          sentiment: 'positive',
          recommended: true,
          is_competitor: true,
          highlights: ['Tracks prompts'],
        },
        {
          name: 'OtterlyAI',
          matched_names: ['OtterlyAI'],
          website: null,
          sentiment: 'neutral',
          recommended: false,
          is_competitor: true,
          highlights: ['Cheap'],
        },
        {
          name: 'SE Ranking',
          matched_names: ['SE Ranking'],
          website: 'behindrankings.com',
          sentiment: 'neutral',
          recommended: false,
          is_competitor: true,
          highlights: [],
        },
        {
          name: 'AI',
          matched_names: ['AI'],
          website: null,
          sentiment: 'neutral',
          recommended: false,
          is_competitor: false,
          highlights: [],
        },
      ],
      input
    )
    expect(rows).toHaveLength(2)
    const otterly = rows.find((r) => r.key === 'otterly')!
    expect(otterly.matchedNames).toEqual(['Otterly.ai', 'OtterlyAI'])
    expect(otterly.highlights).toEqual(['Tracks prompts', 'Cheap'])
    expect(otterly.website).toBe('otterly.ai')
    expect(otterly.recommended).toBe(true)
    expect(rows.find((r) => r.key === 'seranking')!.website).toBeNull()
  })

  it('treats a recommended brand as a competitor even when the extractor said otherwise', () => {
    const rows = normalizeExtractedBrands(
      [
        {
          name: 'Netlify',
          matched_names: ['Netlify'],
          website: 'netlify.com',
          sentiment: 'positive',
          recommended: true,
          is_competitor: false,
          highlights: [],
        },
        {
          name: 'GitHub',
          matched_names: ['GitHub'],
          website: 'github.com',
          sentiment: 'neutral',
          recommended: false,
          is_competitor: false,
          highlights: [],
        },
      ],
      input
    )
    expect(rows.find((r) => r.key === 'netlify')!.isCompetitor).toBe(true)
    expect(rows.find((r) => r.key === 'github')!.isCompetitor).toBe(false)
  })

  it('flags the tracked brand and never marks it as a competitor', () => {
    const rows = normalizeExtractedBrands(
      [
        {
          name: 'Searcherries AI',
          matched_names: ['Searcherries'],
          website: 'searcherries.com',
          sentiment: 'positive',
          recommended: true,
          is_competitor: true,
          highlights: [],
        },
      ],
      input
    )
    expect(rows[0].isSelf).toBe(true)
    expect(rows[0].isCompetitor).toBe(false)
  })
})
