import type { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug = '' } = req.query

  if (req.query.slug.length === 0) {
    res.status(400).json({
      message: 'Missing slug',
    })
    return
  }

  const body = JSON.stringify({ slug })

  const request = await fetch(process.env.SUPABASE_URL + '/rest/v1/analytics', {
    headers: {
      apikey: process.env.SUPABASE_ANON_KEY!,
      'Content-Type': 'application/json',
    },
    body,
    method: 'POST',
  })

  if (request.status !== 201) {
    res.status(request.status).json({ error: 'Error logging analytics' })
    console.error('Error logging analytics: ', body)
  }
  res.status(201).json({ success: true })
}
