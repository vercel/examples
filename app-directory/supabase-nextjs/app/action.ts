'use server'

import { createSupabaseServer } from '../lib/supabase/server'

export async function createNote(formData: FormData) {
  try {
    const username = formData.get('username').trim()
    const title = formData.get('title').trim()
    const description = formData.get('description').trim()

    if (
      typeof username !== 'string' ||
      typeof title !== 'string' ||
      typeof description !== 'string'
    ) {
      throw new Error('Missing required fields')
    }

    const supabase = await createSupabaseServer()

    const { error } = await supabase.from('notes').insert({
      username,
      title,
      description,
    })

    if (error) {
      throw new Error(error.message)
    }
  } catch (err: any) {
    console.error('Error creating note:', err?.message ?? err)
    throw err
  }
}
