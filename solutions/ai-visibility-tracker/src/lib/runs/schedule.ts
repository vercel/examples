import type { Question } from '@/lib/db/schema'

/** Weekly questions run again after six and a half days so a daily cron never skips a week. */
export const WEEKLY_INTERVAL_MS = 6.5 * 86_400_000

export function isQuestionDue(
  question: Pick<Question, 'isActive' | 'cadence' | 'lastRunAt'>,
  now: Date
): boolean {
  if (!question.isActive) return false
  if (question.cadence === 'daily') return true
  if (!question.lastRunAt) return true
  return now.getTime() - question.lastRunAt.getTime() >= WEEKLY_INTERVAL_MS
}
