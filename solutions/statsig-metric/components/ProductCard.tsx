import { useState } from 'react'
import type { Product } from '../types'
import { Statsig } from 'statsig-react'
import Image from 'next/image'
import { Button, LoadingDots } from '@vercel/examples-ui'

interface Props {
  product: Product
}

export function ProductCard({ product }: Props) {
  const [added, setAdded] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleAddToCart = () => {
    setAdded(true)
    // Non blocking call to ensure the UX stays good
    Statsig.logEvent('mug-added-to-cart')
  }

  const handleRemoveFromCart = () => {
    setAdded(false)
    // Non blocking call to ensure the UX stays good
    Statsig.logEvent('mug-removed-from-cart')
  }

  const buttonHandler = () => {
    // not necessary, just part of simulating a cart
    setLoading(true)

    added ? handleRemoveFromCart() : handleAddToCart()
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="ml-14 lg:ml-24 -mb-40 lg:-mb-56">
        <Image
          className="pointer-events-none"
          alt={product.title}
          src="/mug.png"
          width="440"
          height="440"
          layout="responsive"
        />
      </div>
      <section className="border border-gray-300 bg-white rounded-lg shadow-lg mt-16 w-full hover:shadow-2xl transition pt-16 lg:pt-24">
        <div className="p-4 flex flex-col justify-center items-center border-b">
          <div className="flex justify-between w-full items-baseline">
            <div className="ml-4 mr-auto text-left flex flex-col">
              <h4 className="font-semibold text-xl">{product.title}</h4>
              <h5 className="text-gray-700">{product.description}</h5>
            </div>
            <h4 className="font-bold text-lg">USD {product.price}</h4>
          </div>
        </div>
        <div className="p-4 gap-4 flex flex-col justify-center items-center border-b">
          <Button
            role="button"
            onClick={buttonHandler}
            className="py-4 px-6 text-lg w-full bg-black text-center text-white hover:text-white rounded-md hover:bg-gray-900"
          >
            {loading ? (
              <LoadingDots />
            ) : added ? (
              'Remove from cart'
            ) : (
              'Add to cart'
            )}
          </Button>
        </div>
      </section>
    </div>
  )
}
