import type { EdgeRequest, NextApiRequest } from 'next'

export default function getIP(req: EdgeRequest | NextApiRequest) {
  const xff =
    typeof req.headers.get === 'function'
      ? req.headers.get('x-forwarded-for')
      : (req as NextApiRequest).headers['x-forwarded-for']

  return xff ? (Array.isArray(xff) ? xff[0] : xff.split(',')[0]) : '127.0.0.1'
}
