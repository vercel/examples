import { proceedToCheckoutColorFlag } from '@/flags'
import { OrderSummarySection } from '@/components/shopping-cart/order-summary-section'
import { ProceedToCheckoutButton } from '@/components/shopping-cart/proceed-to-checkout-button'

export async function OrderSummary({
  showSummerBanner,
  freeDelivery,
}: {
  showSummerBanner: boolean
  freeDelivery: boolean
}) {
  const proceedToCheckoutColor = await proceedToCheckoutColorFlag()

  return (
    <OrderSummarySection
      showSummerBanner={showSummerBanner}
      freeDelivery={freeDelivery}
      proceedToCheckout={
        <ProceedToCheckoutButton color={proceedToCheckoutColor} />
      }
    />
  )
}
