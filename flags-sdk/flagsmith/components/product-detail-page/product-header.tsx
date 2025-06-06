import { ProductReviews } from './product-reviews'

export function ProductHeader() {
  return (
    <div className="lg:col-span-5 lg:col-start-8">
      <div className="flex justify-between">
        <h1 className="text-xl font-medium text-gray-900">Circles T-Shirt</h1>
        <p className="text-xl font-medium text-gray-900">20.00 USD</p>
      </div>
      <ProductReviews />
    </div>
  )
}
