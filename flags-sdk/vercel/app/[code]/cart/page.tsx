import { OrderSummarySection } from '@/components/shopping-cart/order-summary-section'
import { ProceedToCheckout } from './proceed-to-checkout'
import { Main } from '@/components/main'
import { ShoppingCart } from '@/components/shopping-cart/shopping-cart'
import {
  productFlags,
  showFreeDeliveryBannerFlag,
  showSummerBannerFlag,
  proceedToCheckoutColorFlag,
} from '@/flags'

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
        <OrderSummarySection
          showSummerBanner={showSummerBanner}
          freeDelivery={freeDeliveryBanner}
          proceedToCheckout={
            <ProceedToCheckout color={proceedToCheckoutColor} />
          }
        />
      </div>
    </Main>
  )
}
