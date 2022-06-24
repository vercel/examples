import type { NextApiRequest, NextApiResponse } from 'next'
import { expireUserCookie } from '@lib/auth'

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
    const resWithExpire = await expireUserCookie(res)
    return resWithExpire.status(200).json({ deleted: true })
  } catch (err) {
    console.log(err)
    return res
      .status(401)
      .json({ error: { message: 'Your token has expired.' } })
  }
}
