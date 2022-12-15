import { NextRequest, NextResponse } from 'next/server'
import Statsig from 'statsig-node'
import { EdgeConfigDataAdapter } from 'statsig-node-vercel'
import { EXPERIMENT, UID_COOKIE, GROUP_PARAM_FALLBACK } from './lib/constants'

// We'll use this to validate a random UUID
const IS_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{16}$/i
const dataAdapter = new EdgeConfigDataAdapter(process.env.EDGE_CONFIG_ITEM_KEY!)

export const config = {
  matcher: '/',
}

export async function middleware(req: NextRequest) {
  // Get the user ID from the cookie or get a new one
  let uidCookieValue = req.cookies.get(UID_COOKIE)
  // In Next.js 13, the value returned from cookies.get() is an object with the
  // type: { name: string, value: string }
  // This check makes it compatible with Next.js 12 and 13

  return NextResponse.json({ uidCookieValue })
}
