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
  // Checks for users that are created for E2E testing. For the purposes of this
  // example we don't check for the token's validity because there's no real DB.
  // But in a real application you can use something like this to know which users
  // need to be cleaned periodically.
  if (username.startsWith('tes123-')) {
    const token = req.headers['authorization']
    if (!token) {
      res.status(403).json({ error: { message: 'Invalid auth.' } })
      return
    }
  }

  try {
    await db.signup({ username, password }, res)
    res.status(200).json({ success: true })
  } catch (err: any) {
    res.status(500).json({ error: { message: err.message } })
  }
}
