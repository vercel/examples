import type { NextApiRequest, NextApiResponse } from 'next'
import supabase from '../../lib/supabase'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const homeQuery = supabase
      .from('analytics')
      .select('*', { count: 'exact' })
      .eq('slug', '/')
      .then((res) => res.count)

    const otherQuery = supabase
      .from('analytics')
      .select('*', { count: 'exact' })
      .eq('slug', '/other')
      .then((res) => res.count)

    const [home, other] = await Promise.all([homeQuery, otherQuery])

    res.status(200).json({
      home,
      other,
    })
  } catch (err) {
    res.status(500).json({
      error: err,
    })
  }
}
