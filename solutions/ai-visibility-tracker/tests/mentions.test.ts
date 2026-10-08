import { describe, expect, it } from 'vitest'
import {
  detectCitation,
  findMentions,
  hostMatchesDomain,
  normalizeDomain,
  rankBrands,
} from '@/lib/analysis/mentions'

describe('findMentions', () => {
  it('matches whole words case-insensitively', () => {
    const { count, firstIndex } = findMentions(
      'I use Acme daily. ACME is great, acmeco is not.',
      ['Acme']
    )
    expect(count).toBe(2)
    expect(firstIndex).toBe(6)
  })

  it('supports aliases and names with punctuation', () => {
    expect(
      findMentions('Try monday.com or Notion.', ['monday.com']).count
    ).toBe(1)
    expect(findMentions('We like C++ and .NET.', ['C++', '.NET']).count).toBe(2)
  })

  it('handles unicode boundaries', () => {
    expect(
      findMentions('Используйте Яндекс для поиска', ['Яндекс']).count
    ).toBe(1)
    expect(findMentions('Яндексовский сервис', ['Яндекс']).count).toBe(0)
  })

  it('returns zero for empty names', () => {
    expect(findMentions('anything', ['', '  '])).toEqual({
      count: 0,
      firstIndex: null,
    })
  })
})

describe('normalizeDomain', () => {
  it('strips scheme, www, path and case', () => {
    expect(normalizeDomain('https://www.Example.com/path?x=1')).toBe(
      'example.com'
    )
    expect(normalizeDomain('Example.co.uk/')).toBe('example.co.uk')
    expect(normalizeDomain('  app.example.com:8080 ')).toBe('app.example.com')
  })

  it('matches hosts to domains including subdomains', () => {
    expect(hostMatchesDomain('blog.example.com', 'example.com')).toBe(true)
    expect(hostMatchesDomain('example.com', 'example.com')).toBe(true)
    expect(hostMatchesDomain('notexample.com', 'example.com')).toBe(false)
  })
})

describe('detectCitation', () => {
  it('finds the domain among sources', () => {
    const result = detectCitation(
      'text',
      [{ url: 'https://other.com' }, { url: 'https://docs.example.com/a' }],
      'example.com'
    )
    expect(result).toEqual({ cited: true, url: 'https://docs.example.com/a' })
  })

  it('finds a link in the text when sources are empty', () => {
    expect(
      detectCitation('See https://example.com/pricing.', [], 'www.example.com')
    ).toEqual({
      cited: true,
      url: 'https://example.com/pricing',
    })
  })

  it('finds a bare domain mention but not a superstring', () => {
    expect(
      detectCitation('Visit example.com for more', [], 'example.com').cited
    ).toBe(true)
    expect(
      detectCitation('Visit notexample.com for more', [], 'example.com').cited
    ).toBe(false)
  })
})

describe('rankBrands', () => {
  it('orders brands by first appearance', () => {
    const text = 'Top picks: Notion, then Acme, then ClickUp. Acme again.'
    const rank = rankBrands(text, [
      { key: 'acme', names: ['Acme'] },
      { key: 'notion', names: ['Notion'] },
      { key: 'clickup', names: ['ClickUp', 'Click Up'] },
      { key: 'missing', names: ['Missing'] },
    ])
    expect(rank.get('notion')).toBe(1)
    expect(rank.get('acme')).toBe(2)
    expect(rank.get('clickup')).toBe(3)
    expect(rank.has('missing')).toBe(false)
  })
})
