export type PeriodKey = '7d' | '30d' | '90d'

export const PERIODS: ReadonlyArray<{
  key: PeriodKey
  label: string
  days: number
}> = [
  { key: '7d', label: '7 days', days: 7 },
  { key: '30d', label: '30 days', days: 30 },
  { key: '90d', label: '90 days', days: 90 },
]

export function parsePeriod(value: unknown): PeriodKey {
  return PERIODS.some((p) => p.key === value) ? (value as PeriodKey) : '30d'
}

export interface PeriodRange {
  key: PeriodKey
  days: number
  since: Date
  /** Start of the equally long period before `since`, for deltas. */
  previousSince: Date
}

export function periodRange(
  key: PeriodKey,
  now: Date = new Date()
): PeriodRange {
  const days = PERIODS.find((p) => p.key === key)?.days ?? 30
  const since = new Date(now.getTime() - days * 86_400_000)
  const previousSince = new Date(since.getTime() - days * 86_400_000)
  return { key, days, since, previousSince }
}
