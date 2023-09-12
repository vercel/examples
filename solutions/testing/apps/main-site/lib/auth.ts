import type { NextApiRequest } from 'next'
import type { NextRequest } from 'next/server'

export const USER_ID_COOKIE = 'user_id'

export function getUserIdFromReq(req: NextRequest | NextApiRequest) {
  const userId =
    typeof req.cookies.get === 'function'
      ? req.cookies.get(USER_ID_COOKIE)?.value
      : (req.cookies as NextApiRequest['cookies'])[USER_ID_COOKIE]
  return userId
}
