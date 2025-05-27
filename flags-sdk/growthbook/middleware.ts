import { type NextRequest, NextResponse } from 'next/server'
import { precompute } from 'flags/next'
import { productFlags } from '@/flags'
import { getStableId } from './lib/get-stable-id'
import { getCartId } from './lib/get-cart-id'

export const config = {
  matcher: ['/', '/cart'],
}

export async function middleware(request: NextRequest) {
  const stableId = await getStableId()
  const cartId = await getCartId()

  const code = await precompute(productFlags)

  // rewrites the request to the variant for this flag combination
  const nextUrl = new URL(
    `/${code}${request.nextUrl.pathname}${request.nextUrl.search}`,
    request.url
  )

  // Add a header to the request to indicate that the stable id is generated,
  // as it will not be present on the cookie request header on the first-ever request.
  if (cartId.isFresh) {
    request.headers.set('x-generated-cart-id', cartId.value)
  }

  if (stableId.isFresh) {
    request.headers.set('x-generated-stable-id', stableId.value)
  }

  // response headers
  const headers = new Headers()
  headers.append('set-cookie', `stable-id=${stableId.value}`)
  headers.append('set-cookie', `cart-id=${cartId.value}`)
  return NextResponse.rewrite(nextUrl, { request, headers })
}
