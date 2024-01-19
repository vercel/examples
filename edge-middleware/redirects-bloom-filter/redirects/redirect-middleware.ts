import { NextRequest, NextResponse } from 'next/server'
import RedirectBloomFilter from './redirects-bloom-filter.json'
import ScalableBloomFilter from 'bloom-filters/dist/bloom/scalable-bloom-filter'

const bloomFilter = ScalableBloomFilter.fromJSON(RedirectBloomFilter as any)

/**
 * Redirects the user to the target URL if the path is in the redirects list.
 *
 * Call this from `middleware.ts` for implementing redirects via middleware.
 */
export async function redirectMiddleware(request: NextRequest) {
  if (bloomFilter.has(request.nextUrl.pathname)) {
    console.info('Redirect found in bloom filter', request.nextUrl.pathname)
    const redirectServiceUrl = new URL(
      `/api/redirects?pathname=${encodeURIComponent(request.nextUrl.pathname)}`,
      request.nextUrl.origin
    )
    const redirectResponse = await fetch(redirectServiceUrl, {
      redirect: 'manual',
      headers: {
        'x-vercel-protection-bypass':
          process.env.VERCEL_AUTOMATION_BYPASS_SECRET || '',
      },
    })
    if (redirectResponse.status === 404) {
      return
    }
    if (redirectResponse.status > 300 && redirectResponse.status < 400) {
      console.info('Redirecting to', redirectResponse.headers.get('Location'))
      const redirectUrl = redirectResponse.headers.get('Location')
      if (!redirectUrl) {
        console.error('Missing Location header')
        return
      }
      return NextResponse.redirect(redirectUrl, {
        status: redirectResponse.status,
      })
    }
    console.error(
      'Unexpected /api/redirects response',
      redirectResponse.status,
      await redirectResponse.text()
    )
  }
}
