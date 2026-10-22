import { describe, it, expect } from 'vitest'
import {
  validateContactForm,
  fieldsToRecord,
} from '../app/api/messages/helpers'

describe('validateContactForm', () => {
  it('accepts valid input', () => {
    const result = validateContactForm({
      name: 'Alice',
      email: 'alice@example.com',
      message: 'Hello!',
    })
    expect(result).toEqual({
      valid: true,
      data: { name: 'Alice', email: 'alice@example.com', message: 'Hello!' },
    })
  })

  it('trims whitespace', () => {
    const result = validateContactForm({
      name: '  Bob  ',
      email: ' bob@test.com ',
      message: ' Hi there ',
    })
    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.data.name).toBe('Bob')
      expect(result.data.email).toBe('bob@test.com')
      expect(result.data.message).toBe('Hi there')
    }
  })

  it('rejects missing name', () => {
    const result = validateContactForm({ email: 'a@b.com', message: 'hi' })
    expect(result).toEqual({
      valid: false,
      error: 'Name is required and must be a string',
    })
  })

  it('rejects missing email', () => {
    const result = validateContactForm({ name: 'A', message: 'hi' })
    expect(result).toEqual({
      valid: false,
      error: 'Email is required and must be a string',
    })
  })

  it('rejects missing message', () => {
    const result = validateContactForm({ name: 'A', email: 'a@b.com' })
    expect(result).toEqual({
      valid: false,
      error: 'Message is required and must be a string',
    })
  })

  it('rejects non-string name', () => {
    const result = validateContactForm({
      name: 123,
      email: 'a@b.com',
      message: 'hi',
    })
    expect(result.valid).toBe(false)
  })

  it('rejects name over 200 chars', () => {
    const result = validateContactForm({
      name: 'x'.repeat(201),
      email: 'a@b.com',
      message: 'hi',
    })
    expect(result).toEqual({
      valid: false,
      error: 'Name must be 200 characters or fewer',
    })
  })

  it('accepts name at exactly 200 chars', () => {
    const result = validateContactForm({
      name: 'x'.repeat(200),
      email: 'a@b.com',
      message: 'hi',
    })
    expect(result.valid).toBe(true)
  })

  it('rejects email over 320 chars', () => {
    const result = validateContactForm({
      name: 'A',
      email: 'x'.repeat(321),
      message: 'hi',
    })
    expect(result).toEqual({
      valid: false,
      error: 'Email must be 320 characters or fewer',
    })
  })

  it('rejects message over 10000 chars', () => {
    const result = validateContactForm({
      name: 'A',
      email: 'a@b.com',
      message: 'x'.repeat(10001),
    })
    expect(result).toEqual({
      valid: false,
      error: 'Message must be 10000 characters or fewer',
    })
  })

  it('rejects empty string name', () => {
    const result = validateContactForm({
      name: '',
      email: 'a@b.com',
      message: 'hi',
    })
    expect(result.valid).toBe(false)
  })

  it('rejects null input', () => {
    const result = validateContactForm(null as any)
    expect(result).toEqual({ valid: false, error: 'Invalid request body' })
  })

  it('rejects undefined input', () => {
    const result = validateContactForm(undefined as any)
    expect(result).toEqual({ valid: false, error: 'Invalid request body' })
  })
})

describe('fieldsToRecord', () => {
  it('converts field pairs to record', () => {
    const result = fieldsToRecord([
      ['name', 'Alice'],
      ['email', 'alice@test.com'],
      ['message', 'Hello'],
    ])
    expect(result).toEqual({
      name: 'Alice',
      email: 'alice@test.com',
      message: 'Hello',
    })
  })

  it('returns empty record for empty array', () => {
    expect(fieldsToRecord([])).toEqual({})
  })

  it('handles numeric-like values as strings', () => {
    const result = fieldsToRecord([['count', '42']])
    expect(result).toEqual({ count: '42' })
  })
})
