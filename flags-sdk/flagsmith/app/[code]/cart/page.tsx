import { OrderSummary } from '@/app/[code]/cart/order-summary'
import { Main } from '@/components/main'
import { ShoppingCart } from '@/components/shopping-cart/shopping-cart'
import {
  productFlags,
  showFreeDeliveryBannerFlag,
  showSummerBannerFlag,
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

  console.log('freeDeliveryBanner', freeDeliveryBanner)

  return (
    <Main>
      <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
        <ShoppingCart />
        <OrderSummary
          showSummerBanner={showSummerBanner}
          freeDelivery={freeDeliveryBanner}
        />
      </div>
    </Main>
  )
}
