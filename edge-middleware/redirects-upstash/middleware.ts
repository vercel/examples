import type { NextRequest } from 'next/server'
import redirects from '@lib/redirects'

export async function middleware(req: NextRequest) {
  return await redirects(req)
}
