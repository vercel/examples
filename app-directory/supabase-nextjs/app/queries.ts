import { createSupabaseServer } from '../lib/supabase/server'

export async function fetchNotes() {
  try {
    const supabase = await createSupabaseServer()

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false }) // ascending: false, to show latest notes on top

    if (error) throw new Error('Error while finding notes')

    return data
  } catch (err: any) {
    console.log(err.message)
    throw err
  }
}
