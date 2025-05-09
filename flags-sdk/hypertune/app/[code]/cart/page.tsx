import { OrderSummary } from '@/components/shopping-cart/order-summary'
import { Main } from '@/components/main'
import { ShoppingCart } from '@/components/shopping-cart/shopping-cart'
import {
  productFlags,
  showFreeDeliveryBannerFlag,
  showSummerBannerFlag,
} from '@/flags'
import { Suspense } from 'react'

export const experimental_ppr = true

export default async function CartPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  const showSummerBanner = await showSummerBannerFlag(code, productFlags)
  const freeDeliveryBanner = await showFreeDeliveryBannerFlag(
    code,
    productFlags
  )

  return (
    <Main>
      <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
        <ShoppingCart />
        <Suspense>
          <OrderSummary
            showSummerBanner={showSummerBanner}
            freeDelivery={freeDeliveryBanner}
          />
        </Suspense>
      </div>
    </Main>
  )
}
