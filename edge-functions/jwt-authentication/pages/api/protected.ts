import { type NextRequest } from 'next/server'
import { jsonResponse } from '@lib/utils'

export const config = {
  runtime: 'edge',
}

export default async function protect(req: NextRequest) {
  return jsonResponse(200, { success: true })
}
