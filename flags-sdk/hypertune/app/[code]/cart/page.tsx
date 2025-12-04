import { Main } from '@/components/main'
import { ShoppingCart } from '@/components/shopping-cart/shopping-cart'
import { ProceedToCheckoutButton } from '@/components/shopping-cart/proceed-to-checkout-button'
import { OrderSummarySection } from '@/components/shopping-cart/order-summary-section'
import {
  productFlags,
  showFreeDeliveryBannerFlag,
  showSummerBannerFlag,
  proceedToCheckoutColorFlag,
} from '@/flags'
import { Suspense } from 'react'

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
  const proceedToCheckoutColor = await proceedToCheckoutColorFlag(
    code,
    productFlags
  )

  return (
    <Main>
      <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
        <ShoppingCart />
        <Suspense>
          <OrderSummarySection
            showSummerBanner={showSummerBanner}
            freeDelivery={freeDeliveryBanner}
            proceedToCheckout={
              <ProceedToCheckoutButton color={proceedToCheckoutColor} />
            }
          />
        </Suspense>
      </div>
    </Main>
  )
}
