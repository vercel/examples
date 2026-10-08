import { describe, expect, it } from 'vitest'
import {
  deriveSessionToken,
  isValidSessionToken,
  safeEqual,
} from '@/lib/auth/token'
import { toCsv } from '@/lib/export/csv'
import { isQuestionDue } from '@/lib/runs/schedule'

describe('session tokens', () => {
  it('derives a stable token that validates and cannot be forged', async () => {
    const token = await deriveSessionToken('secret')
    expect(token).toHaveLength(64)
    expect(await deriveSessionToken('secret')).toBe(token)
    expect(await isValidSessionToken(token, 'secret')).toBe(true)
    expect(await isValidSessionToken(token, 'other')).toBe(false)
    expect(await isValidSessionToken(undefined, 'secret')).toBe(false)
    expect(await isValidSessionToken(token, '')).toBe(false)
    expect(safeEqual('abc', 'abd')).toBe(false)
  })
})

describe('toCsv', () => {
  it('quotes commas, quotes and newlines', () => {
    const csv = toCsv(
      [
        {
          a: 'x,"y"',
          b: 'line\nbreak',
          c: null,
          d: new Date('2026-01-01T00:00:00Z'),
        },
      ],
      ['a', 'b', 'c', 'd']
    )
    expect(csv).toBe(
      'a,b,c,d\r\n"x,""y""","line\nbreak",,2026-01-01T00:00:00.000Z\r\n'
    )
  })
})

describe('isQuestionDue', () => {
  const now = new Date('2026-10-07T06:00:00Z')
  it('runs daily questions every day and weekly ones after six and a half days', () => {
    expect(
      isQuestionDue({ isActive: true, cadence: 'daily', lastRunAt: now }, now)
    ).toBe(true)
    expect(
      isQuestionDue({ isActive: false, cadence: 'daily', lastRunAt: null }, now)
    ).toBe(false)
    expect(
      isQuestionDue({ isActive: true, cadence: 'weekly', lastRunAt: null }, now)
    ).toBe(true)
    expect(
      isQuestionDue(
        {
          isActive: true,
          cadence: 'weekly',
          lastRunAt: new Date('2026-10-02T06:00:00Z'),
        },
        now
      )
    ).toBe(false)
    expect(
      isQuestionDue(
        {
          isActive: true,
          cadence: 'weekly',
          lastRunAt: new Date('2026-09-30T06:00:00Z'),
        },
        now
      )
    ).toBe(true)
  })
})
