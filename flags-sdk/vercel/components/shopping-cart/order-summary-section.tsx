import { getCart } from '@/lib/actions'
import Link from 'next/link'
import { Suspense } from 'react'

function OrderSummaryFallback({
  showSummerBanner,
}: {
  showSummerBanner: boolean
}) {
  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-5 w-20 animate-pulse rounded bg-gray-200" />
        <div className="h-5 w-16 animate-pulse rounded bg-gray-200" />
      </div>
      {showSummerBanner ? (
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="h-5 w-28 animate-pulse rounded bg-gray-200" />
          <div className="h-5 w-16 animate-pulse rounded bg-gray-200" />
        </div>
      ) : null}
      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
        <div className="h-5 w-28 animate-pulse rounded bg-gray-200" />
        <div className="h-5 w-16 animate-pulse rounded bg-gray-200" />
      </div>
      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
        <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
        <div className="h-6 w-16 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  )
}

async function OrderSummaryContent({
  showSummerBanner,
  freeDelivery,
}: {
  showSummerBanner: boolean
  freeDelivery: boolean
}) {
  const { items } = await getCart()
  const subtotal = items.length * 20 // Assuming $20 per shirt
  const summerDiscount = showSummerBanner ? subtotal * (20 / 100) * -1 : 0 // 20% discount
  const qualifyingForFreeDelivery = freeDelivery && subtotal > 30
  const shippingCost = 5
  const shipping = qualifyingForFreeDelivery ? 0 : shippingCost
  const total = subtotal + shipping + summerDiscount

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">Subtotal</p>
        <p className="text-sm font-medium text-gray-900">
          {subtotal.toFixed(2)} USD
        </p>
      </div>
      {showSummerBanner ? (
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-600">Summer discount</p>
          <p className="text-sm font-medium text-gray-900">
            {summerDiscount.toFixed(2)} USD
          </p>
        </div>
      ) : null}
      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-600">Shipping estimate</p>
        {qualifyingForFreeDelivery ? (
          <p className="text-sm font-medium text-gray-900">
            <span className="line-through font-normal">
              {shipping.toFixed(2)} USD
            </span>{' '}
            FREE
          </p>
        ) : (
          <p className="text-sm font-medium text-gray-900">
            {shipping.toFixed(2)} USD
          </p>
        )}
      </div>
      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
        <p className="text-base font-medium text-gray-900">Order total</p>
        <p className="text-base font-medium text-gray-900">
          {total.toFixed(2)} USD
        </p>
      </div>
    </div>
  )
}

export function OrderSummarySection({
  showSummerBanner,
  freeDelivery,
  proceedToCheckout,
}: {
  showSummerBanner: boolean
  freeDelivery: boolean
  proceedToCheckout: React.ReactNode
}) {
  return (
    <section className="mt-16 rounded-lg bg-gray-50 px-6 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

      <div className="mt-6">{proceedToCheckout}</div>

      <Suspense
        fallback={<OrderSummaryFallback showSummerBanner={showSummerBanner} />}
      >
        <OrderSummaryContent
          showSummerBanner={showSummerBanner}
          freeDelivery={freeDelivery}
        />
      </Suspense>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>
          or{' '}
          <Link
            href="/"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Continue Shopping
          </Link>
        </p>
      </div>
    </section>
  )
}
