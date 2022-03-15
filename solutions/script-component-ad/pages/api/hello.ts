import type { NextApiRequest, NextApiResponse } from 'next'

/**
 * @docs https://nextjs.org/docs/api-routes/introduction
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name } = req.query
  res.end(`Hello ${name}!`)
}
