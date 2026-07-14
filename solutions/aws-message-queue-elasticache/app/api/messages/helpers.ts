import type { GlideString } from '@valkey/valkey-glide'

export type ContactDataForm = { name: string; email: string; message: string }

export type ValidationSuccess = {
  valid: true
  data: ContactDataForm
}

export type ValidationError = {
  valid: false
  error: string
}

export type ValidationResult = ValidationSuccess | ValidationError

/** Shared message shape returned by the API and consumed by the UI. */
export interface StreamMessage {
  streamMessageId: string
  name: string
  email: string
  message: string
  timestamp: string
  claimed?: boolean
}

export function validateContactForm(data: unknown): ValidationResult {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid request body' }
  }
  const d = data as Record<string, unknown>
  if (!d.name || typeof d.name !== 'string' || !d.name.trim()) {
    return { valid: false, error: 'Name is required and must be a string' }
  }
  if (d.name.length > 200) {
    return { valid: false, error: 'Name must be 200 characters or fewer' }
  }
  if (!d.email || typeof d.email !== 'string' || !d.email.trim()) {
    return { valid: false, error: 'Email is required and must be a string' }
  }
  if (d.email.length > 320) {
    return { valid: false, error: 'Email must be 320 characters or fewer' }
  }
  if (!d.message || typeof d.message !== 'string' || !d.message.trim()) {
    return { valid: false, error: 'Message is required and must be a string' }
  }
  if (d.message.length > 10000) {
    return { valid: false, error: 'Message must be 10000 characters or fewer' }
  }

  return {
    valid: true,
    data: {
      name: d.name.trim(),
      email: d.email.trim(),
      message: d.message.trim(),
    },
  }
}

export function fieldsToRecord(fieldsArray: [GlideString, GlideString][]): Record<string, string> {
  const record: Record<string, string> = {}
  for (const [field, value] of fieldsArray) {
    record[String(field)] = String(value)
  }
  return record
}

export function buildMessageResponse(
  streamMessageId: string,
  fieldsArray: [GlideString, GlideString][],
  options?: { claimed?: boolean }
): StreamMessage {
  const data = fieldsToRecord(fieldsArray)
  return {
    streamMessageId,
    name: data.name,
    email: data.email,
    message: data.message,
    timestamp: data.timestamp,
    ...(options?.claimed && { claimed: true }),
  }
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'An unexpected error occurred'
}
