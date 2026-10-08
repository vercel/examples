'use server'

import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { writeDenied } from '@/lib/auth/session'
import { getDb } from '@/lib/db'
import { questions, type QuestionCadence } from '@/lib/db/schema'
import { getBrand } from '@/lib/queries/brand'

export interface QuestionFormState {
  error: string | null
  added: number
}

const MAX_QUESTIONS = 200
const MAX_LENGTH = 300

function cadenceOf(value: FormDataEntryValue | null): QuestionCadence {
  return value === 'weekly' ? 'weekly' : 'daily'
}

export async function addQuestions(
  _previous: QuestionFormState,
  formData: FormData
): Promise<QuestionFormState> {
  const denied = await writeDenied()
  if (denied) return { error: denied, added: 0 }
  const db = await getDb()
  const brand = await getBrand(db)
  if (!brand) return { error: 'Set up your brand first.', added: 0 }

  const lines = String(formData.get('questions') ?? '')
    .split('\n')
    .map((line) => line.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, '').trim())
    .filter((line) => line.length > 0)
  if (lines.length === 0)
    return { error: 'Enter at least one question, one per line.', added: 0 }
  const tooLong = lines.find((line) => line.length > MAX_LENGTH)
  if (tooLong)
    return {
      error: `Questions must be under ${MAX_LENGTH} characters.`,
      added: 0,
    }

  const existing = await db
    .select({ text: questions.text })
    .from(questions)
    .where(eq(questions.brandId, brand.id))
  if (existing.length + lines.length > MAX_QUESTIONS) {
    return {
      error: `You can track up to ${MAX_QUESTIONS} questions.`,
      added: 0,
    }
  }
  const known = new Set(existing.map((q) => q.text.toLowerCase()))
  const fresh = Array.from(new Set(lines.map((l) => l.trim()))).filter(
    (line) => !known.has(line.toLowerCase())
  )
  if (fresh.length === 0)
    return { error: 'Those questions are already tracked.', added: 0 }

  const cadence = cadenceOf(formData.get('cadence'))
  await db
    .insert(questions)
    .values(fresh.map((text) => ({ brandId: brand.id, text, cadence })))
  revalidatePath('/questions')
  revalidatePath('/')
  return { error: null, added: fresh.length }
}

export async function updateQuestion(formData: FormData): Promise<void> {
  if (await writeDenied()) return
  const db = await getDb()
  const brand = await getBrand(db)
  const id = Number(formData.get('id'))
  if (!brand || !Number.isInteger(id)) return

  const intent = String(formData.get('intent') ?? '')
  const where = and(eq(questions.id, id), eq(questions.brandId, brand.id))
  if (intent === 'delete') {
    await db.delete(questions).where(where)
  } else if (intent === 'toggle') {
    const [current] = await db
      .select({ isActive: questions.isActive })
      .from(questions)
      .where(where)
      .limit(1)
    if (current)
      await db
        .update(questions)
        .set({ isActive: !current.isActive })
        .where(where)
  } else if (intent === 'cadence') {
    await db
      .update(questions)
      .set({ cadence: cadenceOf(formData.get('cadence')) })
      .where(where)
  }
  revalidatePath('/questions')
  revalidatePath('/')
}
