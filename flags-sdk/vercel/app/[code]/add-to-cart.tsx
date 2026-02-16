'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addToCart } from '@/lib/actions'
import { useProductDetailPageContext } from '@/components/utils/product-detail-page-context'
import { AddToCartButton } from '@/components/product-detail-page/add-to-cart-button'

export function AddToCart() {
  const router = useRouter()
  const { color, size } = useProductDetailPageContext()
  const [isLoading, setIsLoading] = useState(false)

  return (
    <AddToCartButton
      isLoading={isLoading}
      onClick={async () => {
        setIsLoading(true)
        await addToCart({ id: 'shirt', color, size, quantity: 1 })
        router.push('/cart')
      }}
    />
  )
}
