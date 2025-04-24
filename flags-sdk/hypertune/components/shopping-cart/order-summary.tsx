import { proceedToCheckoutColorFlag } from '@/flags'
import { OrderSummarySection } from '@/components/shopping-cart/order-summary-section'
import { ProceedToCheckoutButton } from '@/components/shopping-cart/proceed-to-checkout-button'
import { FlagValues } from 'flags/react'
import { Suspense } from 'react'

async function ProceedToCheckout() {
  const proceedToCheckoutColor = await proceedToCheckoutColorFlag()

  return (
    <>
      <ProceedToCheckoutButton color={proceedToCheckoutColor} />
      <FlagValues
        values={{
          [proceedToCheckoutColorFlag.key]: proceedToCheckoutColor,
        }}
      />
    </>
  )
}

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
        <Suspense fallback={<ProceedToCheckoutButton color="skeleton" />}>
          <ProceedToCheckout />
        </Suspense>
      }
    />
  )
}
