import type { NextApiRequest, NextApiResponse } from 'next'
import db from '../../lib/db'

/**
 * @docs https://nextjs.org/docs/api-routes/introduction
 */
export default async function signup(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username, password } = req.body

  if (req.method !== 'POST') {
    res.status(405).json({ error: { message: 'Method Not Allowed' } })
    return
  }
  if (!username || !password) {
    res.status(400).json({ error: { message: 'Missing username or password' } })
    return
  }

  try {
    await db.signup({ username, password }, res)
    res.status(200).json({ success: true })
  } catch (err: any) {
    res.status(500).json({ error: { message: err.message } })
  }
}
