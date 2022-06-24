import type { NextApiRequest, NextApiResponse } from 'next'
import { setUserCookie } from '@lib/auth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: { message: 'Method not allowed' },
    })
  }
  try {
    const resWithJwt = await setUserCookie(res)
    return resWithJwt.status(200).json({ success: true })
  } catch (err) {
    console.error(err)
    return res
      .status(401)
      .json({ error: { message: 'Your token has expired.' } })
  }
}
