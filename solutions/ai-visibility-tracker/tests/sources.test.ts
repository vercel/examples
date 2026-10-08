import { describe, expect, it } from 'vitest'
import {
  dedupeSources,
  extractUrlsFromText,
  isGoogleRedirect,
  normalizeUrl,
  resolveGoogleRedirects,
  sourcesFromTrailingSection,
} from '@/lib/ai/sources'

describe('sources', () => {
  it('normalizes and deduplicates urls', () => {
    expect(normalizeUrl('https://Example.com/a/#top')).toBe(
      'https://example.com/a'
    )
    expect(normalizeUrl('ftp://example.com')).toBeNull()
    expect(normalizeUrl('not a url')).toBeNull()
    const deduped = dedupeSources([
      { url: 'https://example.com/a/', title: null },
      { url: 'https://example.com/a', title: 'A' },
      { url: 'https://example.com/b', title: 'B' },
    ])
    expect(deduped).toEqual([
      { url: 'https://example.com/a', title: 'A' },
      { url: 'https://example.com/b', title: 'B' },
    ])
  })

  it('extracts markdown and bare links from text', () => {
    const text =
      'See [docs](https://example.com/docs) and https://other.com/page. Done.'
    expect(extractUrlsFromText(text)).toEqual([
      'https://example.com/docs',
      'https://other.com/page',
    ])
  })

  it('reads a trailing Sources section with bare domains', () => {
    const text =
      'Answer body.\n\nSources:\n- example.com/pricing\n- https://blog.other.com/post\n- www.third.org'
    expect(sourcesFromTrailingSection(text)).toEqual([
      'https://blog.other.com/post',
      'https://example.com/pricing',
      'https://www.third.org/',
    ])
    expect(sourcesFromTrailingSection('No sources here')).toEqual([])
  })

  it("resolves only Google's grounding redirects", async () => {
    const redirect =
      'https://vertexaisearch.cloud.google.com/grounding-api-redirect/abc'
    expect(isGoogleRedirect(redirect)).toBe(true)
    expect(
      isGoogleRedirect('https://evil.com/grounding-api-redirect/abc')
    ).toBe(false)
    const calls: string[] = []
    const fetchImpl = (async (input: RequestInfo | URL) => {
      calls.push(String(input))
      return new Response(null, {
        status: 302,
        headers: { location: 'https://real.com/article/' },
      })
    }) as typeof fetch
    const resolved = await resolveGoogleRedirects(
      [
        { url: redirect, title: 'T' },
        { url: 'https://plain.com', title: null },
      ],
      { fetchImpl }
    )
    expect(calls).toEqual([redirect])
    expect(resolved).toEqual([
      { url: 'https://real.com/article', title: 'T' },
      { url: 'https://plain.com/', title: null },
    ])
  })
})
