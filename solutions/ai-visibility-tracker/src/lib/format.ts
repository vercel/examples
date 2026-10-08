export function fmtPct(value: number | null | undefined, digits = 0): string {
  return value === null || value === undefined
    ? '—'
    : `${value.toFixed(digits)}%`
}

export function fmtDelta(value: number | null | undefined): string | null {
  if (value === null || value === undefined) return null
  if (value === 0) return 'no change'
  return `${value > 0 ? '+' : '−'}${Math.abs(value).toFixed(1)} pts`
}

export function fmtPosition(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  return Number.isInteger(value) ? `#${value}` : `#${value.toFixed(1)}`
}

export function fmtInt(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

const dateFormat = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})
const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'UTC',
})
const shortDateFormat = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
})

export function fmtDate(value: Date | string | null | undefined): string {
  if (!value) return '—'
  return dateFormat.format(new Date(value))
}

export function fmtShortDate(value: Date | string | null | undefined): string {
  if (!value) return '—'
  return shortDateFormat.format(new Date(value))
}

export function fmtDateTime(value: Date | string | null | undefined): string {
  if (!value) return '—'
  return `${dateTimeFormat.format(new Date(value))} UTC`
}

export function fmtRelative(
  value: Date | string | null | undefined,
  now: Date = new Date()
): string {
  if (!value) return 'never'
  const diff = now.getTime() - new Date(value).getTime()
  const minutes = Math.round(diff / 60_000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} h ago`
  const days = Math.round(hours / 24)
  if (days < 30) return `${days} d ago`
  return fmtDate(value)
}

export function truncate(text: string, max = 120): string {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text
}
