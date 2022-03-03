import type { Product } from '../types'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  return (
    <div className="w-full max-w-xl mx-auto">
      <section className="border border-gray-300 bg-white rounded-lg shadow-lg w-full hover:shadow-2xl transition">
        <div className="p-4 flex flex-col justify-center items-center border-b">
          <div className="flex justify-between w-full items-baseline">
            <div className="mr-auto text-left flex flex-col">
              <h4 className="font-semibold text-xl">{product.title}</h4>
              <h5 className="text-gray-700">{product.description}</h5>
            </div>
            <h4 className="font-bold text-lg">USD {product.price}</h4>
          </div>
        </div>
      </section>
    </div>
  )
}
