import React from 'react'
import { Button, LoadingDots } from '@vercel/examples-ui'
import Image from 'next/image'

export interface Product {
  id: string
  title: string
  description: string
  image: string
  price: string
  stock: number
}

interface Props {
  product: Product
  blur: boolean
}

export function ProductCard({ product, blur }: Props) {
  const [added, setAdded] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const handleAddToCart = () => {
    setLoading(true)
    setTimeout(() => {
      setAdded(true)
      setLoading(false)
    }, 750)
  }

  return (
    <div>
      <div className="relative">
        <div className="w-full flex justify-center rounded-lg overflow-hidden">
          <Image
            className={`pointer-events-none w-full h-full object-center object-cover ${
              blur ? 'blur' : ''
            }`}
            alt={product.title}
            src={product.image}
            width="500"
            height="500"
          />
        </div>
        <div className="absolute top-0 inset-x-0 rounded-lg p-4 flex items-end justify-end overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-36 "
          />
        </div>
      </div>
      {!blur && (
        <div>
          <div className="flex justify-between">
            <div>
              <h3>
                <div>
                  <span
                    aria-hidden="true"
                    className="absolutefont-bold text-xl"
                  />
                  <p className="font-bold text-xl"> {product.title}</p>
                </div>
              </h3>
              <p className="mt-1 ">Limited Edition</p>
            </div>
            <p className="font-bold text-xl ">{product.price} $</p>
          </div>
          <span className="relative flex items-center justify-center ">
            <Button
              disabled={added}
              onClick={handleAddToCart}
              className="w-full mt-4"
            >
              {loading && <LoadingDots />}
              {!loading && !added && 'Add to cart'}
              {!loading && added && 'In cart ✔'}
            </Button>
          </span>
        </div>
      )}
    </div>
  )
}
