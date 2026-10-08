import { describe, expect, it } from 'vitest'
import {
  averagePosition,
  delta,
  platformBreakdown,
  shareOfVoice,
  topDomains,
  trendByDay,
  visibilityScore,
  type ScoredAnswer,
} from '@/lib/analysis/scoring'

function answer(partial: Partial<ScoredAnswer> & { id: number }): ScoredAnswer {
  return {
    platform: 'chatgpt',
    questionId: 1,
    brandMentioned: false,
    brandCited: false,
    brandPosition: null,
    completedAt: new Date('2026-10-07T10:00:00Z'),
    sources: [],
    ...partial,
  }
}

const rows = [
  answer({
    id: 1,
    brandMentioned: true,
    brandPosition: 1,
    sources: [{ url: 'https://a.com/x' }, { url: 'https://www.a.com/y' }],
  }),
  answer({
    id: 2,
    brandMentioned: true,
    brandCited: true,
    brandPosition: 3,
    platform: 'gemini',
    sources: [{ url: 'https://brand.com' }],
  }),
  answer({
    id: 3,
    platform: 'gemini',
    completedAt: new Date('2026-10-06T10:00:00Z'),
    sources: [{ url: 'https://a.com/z' }],
  }),
  answer({ id: 4, completedAt: new Date('2026-10-05T10:00:00Z') }),
]

describe('scoring', () => {
  it('computes visibility score and average position', () => {
    expect(visibilityScore(rows)).toBe(50)
    expect(visibilityScore([])).toBeNull()
    expect(averagePosition(rows)).toBe(2)
  })

  it('breaks down by platform in the configured order', () => {
    const stats = platformBreakdown(rows, ['gemini', 'chatgpt'])
    expect(stats.map((s) => s.platform)).toEqual(['gemini', 'chatgpt'])
    expect(stats[0]).toMatchObject({
      answers: 2,
      mentioned: 1,
      cited: 1,
      score: 50,
    })
  })

  it('fills the trend with every day of the window', () => {
    const trend = trendByDay(rows, 4, new Date('2026-10-07T12:00:00Z'))
    expect(trend.map((p) => p.date)).toEqual([
      '2026-10-04',
      '2026-10-05',
      '2026-10-06',
      '2026-10-07',
    ])
    expect(trend.map((p) => p.score)).toEqual([null, 0, 0, 100])
  })

  it('counts each domain once per answer and flags the own domain', () => {
    const domains = topDomains(rows, 'brand.com')
    expect(domains[0]).toEqual({ domain: 'a.com', answers: 2, isOwn: false })
    expect(domains.find((d) => d.domain === 'brand.com')?.isOwn).toBe(true)
  })

  it('computes share of voice and deltas', () => {
    expect(shareOfVoice(2, [3, 5])).toBe(20)
    expect(shareOfVoice(0, [])).toBeNull()
    expect(delta(55.5, 50)).toBe(5.5)
    expect(delta(null, 50)).toBeNull()
  })
})
