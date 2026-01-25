import { cn, formatDistanceToNow } from '@/lib/utils'

describe('cn (class name merger)', () => {
  it('should merge class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('should handle conditional classes', () => {
    expect(cn('base', true && 'active', false && 'disabled')).toBe('base active')
  })

  it('should handle tailwind conflicts', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2')
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('should handle arrays', () => {
    expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz')
  })

  it('should handle objects', () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz')
  })

  it('should handle undefined and null', () => {
    expect(cn('foo', undefined, null, 'bar')).toBe('foo bar')
  })
})

describe('formatDistanceToNow', () => {
  it('should return "just now" for recent dates', () => {
    const now = new Date()
    expect(formatDistanceToNow(now)).toBe('just now')
  })

  it('should return minutes ago', () => {
    const date = new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
    expect(formatDistanceToNow(date)).toBe('5m ago')
  })

  it('should return hours ago', () => {
    const date = new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
    expect(formatDistanceToNow(date)).toBe('3h ago')
  })

  it('should return days ago', () => {
    const date = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    expect(formatDistanceToNow(date)).toBe('2d ago')
  })

  it('should return weeks ago', () => {
    const date = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // 2 weeks ago
    expect(formatDistanceToNow(date)).toBe('2w ago')
  })

  it('should return months ago', () => {
    const date = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) // ~2 months ago
    expect(formatDistanceToNow(date)).toBe('2mo ago')
  })

  it('should return years ago', () => {
    const date = new Date(Date.now() - 400 * 24 * 60 * 60 * 1000) // ~1 year ago
    expect(formatDistanceToNow(date)).toBe('1y ago')
  })
})
