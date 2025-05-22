import { OrderSummarySection } from '@/components/shopping-cart/order-summary-section'
import { ProceedToCheckout } from './proceed-to-checkout'

export async function OrderSummary({
  showSummerBanner,
  freeDelivery,
}: {
  showSummerBanner: boolean
  freeDelivery: boolean
}) {
  return (
    <OrderSummarySection
      showSummerBanner={showSummerBanner}
      freeDelivery={freeDelivery}
      proceedToCheckout={
        <ProceedToCheckout color={'blue'} experiment="proceed_to_checkout" />
      }
    />
  )
}
