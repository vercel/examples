import type { NextRequest } from 'next/server'
import { getDefinitions, safeCompare } from '@unleash/nextjs'

export const config = {
  runtime: 'experimental-edge',
  // regions: ['sfo1', 'iad1'], // defaults to 'all'
}

/**
 * Optional, defaults to  'nextjs'
 *
 * Try using `package.json` (`nextjs_${pkg.name}_${pkg.version}`)
 */
const appName = 'vercel-edge'

export default async function handler(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') || undefined

  if (
    !(
      process.env.UNLEASH_RELAY_SECRET &&
      token &&
      safeCompare(token || '', process.env.UNLEASH_RELAY_SECRET || '')
    )
  ) {
    return new Response(
      JSON.stringify({
        status: 401,
        error: 'Unauthorized',
        message:
          'Token missing or does not match UNLEASH_RELAY_SECRET environment variable',
      }),
      {
        status: 401,
        headers: { 'content-type': 'application/json' },
      }
    )
  }

  try {
    const response = await getDefinitions({ appName })

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'cache-control':
          // https://vercel.com/docs/concepts/edge-network/caching
          process.env.UNLEASH_CACHE_CONTROL ||
          'public, s-maxage=1, stale-while-revalidate=59',
      },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({
        status: 500,
        error: 'Internal Server Error',
        message: (error as Error)?.message || undefined,
      }),
      {
        status: 500,
        headers: { 'content-type': 'application/json' },
      }
    )
  }
}
