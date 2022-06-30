import { type NextRequest } from 'next/server'
import { setUserCookie } from '@lib/auth'
import { jsonResponse } from '@lib/utils'

export const config = {
  runtime: 'experimental-edge',
}

export default async function auth(req: NextRequest) {
  if (req.method !== 'POST') {
    return jsonResponse(405, { error: { message: 'Method not allowed' } })
  }

  try {
    return await setUserCookie(jsonResponse(200, { success: true }))
  } catch (err) {
    console.error(err)
    return jsonResponse(500, { error: { message: 'Authentication failed.' } })
  }
}
