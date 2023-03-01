import { NextRequest, NextResponse } from 'next/server'
import { addBasePath } from 'next/dist/client/add-base-path'
import { flagsClient, evaluateFlags, randomSessionId } from '@unleash/nextjs'
import { UNLEASH_API_PROXY_DEFINITIONS, UNLEASH_COOKIE_NAME } from './utils'

export const config = {
  runtime: 'experimental-edge',
  matcher: '/ab',
}

export default async function middleware(req: NextRequest) {
  const sessionId =
    req.cookies.get(UNLEASH_COOKIE_NAME)?.value || randomSessionId()

  const context = { sessionId } // You can extend context with other server-side properties

  // Grab definitions from an endpoint cached on the edge
  const protocol = req.url.startsWith('https') ? 'https://' : 'http://'
  const host = req.headers.get('host')
  const endpoint = addBasePath(UNLEASH_API_PROXY_DEFINITIONS)
  const token = process.env.UNLEASH_RELAY_SECRET || ''
  const definitionsUrl = `${protocol}${host}${endpoint}?token=${token}`

  const definitions = await fetch(definitionsUrl).then((res) => res.json())

  // Evaluate based on provided context
  const evaluated = await evaluateFlags(definitions, context)

  const variant = flagsClient(evaluated.toggles).getVariant('nextjs-poc')
    ?.payload?.value

  const newUrl = req.nextUrl.clone()
  // Redirect to variant
  newUrl.pathname = `/ab/${variant === 'a' ? 'a' : 'b'}`
  const res = NextResponse.rewrite(newUrl)
  res.cookies.set(UNLEASH_COOKIE_NAME, sessionId)

  return res
}
