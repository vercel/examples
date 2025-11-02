import { cookies, headers } from 'next/headers'
import { dedupe } from 'flags/next'
import { nanoid } from 'nanoid'

/**
 * Reads the cart id from the cookie or returns a new cart id
 */
export const getCartId = dedupe(async () => {
  const cookiesStore = await cookies()
  const header = await headers()

  const generatedCartId = header.get('x-generated-cart-id')

  if (generatedCartId) {
    return { value: generatedCartId, isFresh: false }
  }

  const cartId = cookiesStore.get('cart-id')?.value
  if (!cartId) return { value: nanoid(), isFresh: true }
  return { value: cartId, isFresh: false }
})
