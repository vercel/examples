import type { NextRequest } from 'next/server'
import { precompute } from 'flags/next'
import { productFlags } from '@/flags'
import { getStableId } from './lib/get-stable-id'
import { getCartId } from './lib/get-cart-id'
import { HTMLRewriter } from 'htmlrewriter'
import { statsigAdapter } from '@flags-sdk/statsig'
import { identify } from './lib/identify'
import { safeJsonStringify } from 'flags'

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

  // Create new headers with the original request headers
  const headers = new Headers(request.headers)

  // Add new headers if needed
  if (cartId.isFresh) {
    headers.set('x-generated-cart-id', cartId.value)
  }

  if (stableId.isFresh) {
    headers.set('x-generated-stable-id', stableId.value)
  }

  // Create a new request with the modified headers
  const modifiedRequest = new Request(nextUrl, { ...request, headers })

  const [statsig, statsigUser, response] = await Promise.all([
    statsigAdapter.initialize(),
    identify(),
    fetch(modifiedRequest),
  ])

  const clientInitializeResponse = statsig.getClientInitializeResponse(
    statsigUser,
    { hash: 'djb2' }
  )

  const rewriter = new HTMLRewriter()
  rewriter.on('script#embed', {
    element(element) {
      element.setInnerContent(
        safeJsonStringify({ clientInitializeResponse, statsigUser }),
        { html: true }
      )
      // element.setAttribute('style', 'display: block')
    },
  })
  const modifiedResponse = rewriter.transform(response)
  const h = new Headers(modifiedResponse.headers)
  h.append('set-cookie', `stable-id=${stableId.value}`)
  h.append('set-cookie', `cart-id=${cartId.value}`)
  return new Response(modifiedResponse.body, {
    ...modifiedResponse,
    headers: h,
  })
}
