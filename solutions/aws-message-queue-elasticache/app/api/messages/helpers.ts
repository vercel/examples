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

export function validateContactForm(data: any): ValidationResult {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid request body' }
  }
  if (!data.name || typeof data.name !== 'string') {
    return { valid: false, error: 'Name is required and must be a string' }
  }
  if (data.name.length > 200) {
    return { valid: false, error: 'Name must be 200 characters or fewer' }
  }
  if (!data.email || typeof data.email !== 'string') {
    return { valid: false, error: 'Email is required and must be a string' }
  }
  if (data.email.length > 320) {
    return { valid: false, error: 'Email must be 320 characters or fewer' }
  }
  if (!data.message || typeof data.message !== 'string') {
    return { valid: false, error: 'Message is required and must be a string' }
  }
  if (data.message.length > 10000) {
    return { valid: false, error: 'Message must be 10000 characters or fewer' }
  }

  return {
    valid: true,
    data: {
      name: data.name.trim(),
      email: data.email.trim(),
      message: data.message.trim(),
    },
  }
}

export function fieldsToRecord(fieldsArray: [string, string][]): Record<string, string> {
  const record: Record<string, string> = {}
  for (const [field, value] of fieldsArray) {
    record[String(field)] = String(value)
  }
  return record
}
