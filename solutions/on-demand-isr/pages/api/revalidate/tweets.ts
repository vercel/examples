import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (process.env.SECRET === req.headers['x-secret-key']) {
    await res.revalidate('/tweets')

    return res.json({ revalidated: true })
  }

  return res.status(401).end()
}
