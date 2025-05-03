import { proceedToCheckoutColorFlag } from '@/flags'
import { OrderSummarySection } from '@/components/shopping-cart/order-summary-section'
import { ProceedToCheckout } from './proceed-to-checkout'

export async function OrderSummary({
  showSummerBanner,
  freeDelivery,
  proceedToCheckoutColor,
}: {
  showSummerBanner: boolean;
  freeDelivery: boolean;
  proceedToCheckoutColor: string;
}) {
  return (
    <OrderSummarySection
      showSummerBanner={showSummerBanner}
      freeDelivery={freeDelivery}
      proceedToCheckout={
        <ProceedToCheckout
          color={proceedToCheckoutColor}
          flagKey={proceedToCheckoutColorFlag.key}
        />
      }
    />
  );
}
