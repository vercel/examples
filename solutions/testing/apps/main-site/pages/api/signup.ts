import { sql } from '@vercel/postgres'
import type { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from 'cookie'

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
  if (username.startsWith('test-e2e-')) {
    const token = req.headers['authorization']
    if (!token) {
      res.status(403).json({ error: { message: 'Invalid auth.' } })
      return
    }
  }

  try {
    // For example purposes we don't have a secure auth flow and instead just save the user to a
    // table and its username is the token cookie, you should not do this on a real app and use
    // something like next-auth instead.
    const something =
      await sql`INSERT INTO users (username, password) VALUES (${username}, ${password})`
    res.setHeader(
      'Set-Cookie',
      serialize('user_id', username, { httpOnly: true, path: '/' })
    )
    res.status(200).json({ success: true })
  } catch (err: any) {
    res.status(500).json({ error: { message: err.message } })
  }
}
