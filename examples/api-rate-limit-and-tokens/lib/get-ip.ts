import type { NextApiRequest } from 'next'

export default function getIP(request: Request | NextApiRequest) {
  const xff =
    request instanceof Request
      ? request.headers.get('x-forwarded-for')
      : request.headers['x-forwarded-for']

  return xff ? (Array.isArray(xff) ? xff[0] : xff.split(',')[0]) : '127.0.0.1'
}
