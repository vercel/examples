'use client'

import { track } from '@vercel/analytics'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { addToCart } from '@/lib/actions'
import { useProductDetailPageContext } from '@/components/utils/product-detail-page-context'
import { AddToCartButton } from '@/components/product-detail-page/add-to-cart-button'

export function AddToCart() {
  const router = useRouter()
  const { color, size } = useProductDetailPageContext()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    track('add_to_cart:viewed')
  }, [])

  return (
    <AddToCartButton
      isLoading={isLoading}
      onClick={async () => {
        setIsLoading(true)
        track('add_to_cart:clicked')
        await addToCart({ id: 'shirt', color, size, quantity: 1 })
        router.push('/cart')
      }}
    />
  )
}
