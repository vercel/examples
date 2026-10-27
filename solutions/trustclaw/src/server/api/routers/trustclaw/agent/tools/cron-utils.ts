import { Cron } from 'croner'

export function computeNextRunAt(expression: string, timezone: string): Date {
  const cron = new Cron(expression, { timezone })
  const next = cron.nextRun()
  if (!next) {
    throw new Error('Invalid cron expression or no future runs')
  }
  return next
}

export function computeNextRunSafe(
  expression: string,
  timezone: string
): Date | null {
  try {
    return computeNextRunAt(expression, timezone)
  } catch {
    return null
  }
}

export function validateCronExpression(expression: string): boolean {
  try {
    new Cron(expression)
    return true
  } catch {
    return false
  }
}
