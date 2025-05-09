'use server'

import { revalidatePath } from 'next/cache'
import type { Cart, CartItem } from '@/components/utils/cart-types'
import { delayFlag } from '@/flags'
import { getCartId } from './get-cart-id'
import { cookies } from 'next/headers'
import { nanoid } from 'nanoid'

// Using a fallback here so we don't need to make the BACKEND_URL part of the env,
// which makes using the template easy..
const BACKEND_URL =
  process.env.BACKEND_URL || 'https://flags-sdk-template.vercel.app'

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function getCart(): Promise<Cart> {
  const cookieStore = await cookies()
  const delayMs = await delayFlag()
  await delay(delayMs)
  const cart = cookieStore.get('cart')
  if (!cart) {
    return {
      id: nanoid(),
      items: [],
    }
  }
  return JSON.parse(cart.value)
}

export async function addToCart(item: CartItem) {
  const cart = await getCart()
  cart.items.push(item)
  const cookieStore = await cookies()
  cookieStore.set('cart', JSON.stringify(cart))
  revalidatePath('/cart')
}

export async function removeFromCart(item: CartItem) {
  const cookieStore = await cookies()
  cookieStore.delete('cart')
  revalidatePath('/cart')
}
