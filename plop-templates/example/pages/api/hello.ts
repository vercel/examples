import type { NextApiRequest, NextApiResponse } from 'next'

/**
 * @docs https://nextjs.org/docs/api-routes/introduction
 */
export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { name } = request.query
  response.end(`Hello ${name}!`)
}
