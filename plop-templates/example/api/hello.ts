import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * @docs https://vercel.com/docs/concepts/functions/serverless-functions
 */
export default function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const { name = 'World' } = request.query
  response.status(200).send(`Hello ${name}!`)
}
