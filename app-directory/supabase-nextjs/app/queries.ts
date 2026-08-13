import { createSupabaseServer } from '../lib/supabase/server'

export async function fetchNotes() {
  try {
    const supabase = await createSupabaseServer()

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false }) // ascending: false, to show latest notes on top

    if (error) throw new Error(error.message)

    return data
  } catch (err: any) {
    console.error('Error fetching notes:', err?.message ?? err)
    throw err
  }
}
