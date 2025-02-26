import { AddToCartButton } from '@/components/add-to-cart-button'
import { FreeDeliveryBanner } from '@/components/banners/free-delivery-banner'
import { SummerBanner } from '@/components/banners/summer-banner'
import { ColorPicker } from '@/components/color-picker'
import { Footer } from '@/components/footer'
import { ImageGallery } from '@/components/image-gallery'
import { Navigation } from '@/components/navigation'
import { ProductDetails } from '@/components/product-details'
import { ProductHeader } from '@/components/product-header'
import { SizePicker } from '@/components/size-picker'
import { StatsigGateExposure } from '@/components/statsig/statsig-gate-exposure'
import {
  productFlags,
  showFreeDeliveryBannerFlag,
  showSummerBannerFlag,
} from '@/flags'
import { generatePermutations, getPrecomputed } from 'flags/next'

export const dynamicParams = true;

export async function generateStaticParams() {
  const codes = await generatePermutations(productFlags);
  return codes.map((code) => ({ code }));
}

export default async function Page(props: {
  params: Promise<{ code: string }>;
}) {
  const params = await props.params;

  const [showSummerBanner, showFreeDeliveryBanner] = await getPrecomputed(
    [showSummerBannerFlag, showFreeDeliveryBannerFlag],
    productFlags,
    params.code,
  );

  return (
    <div className="bg-white">
      <FreeDeliveryBanner show={showFreeDeliveryBanner} />
      <StatsigGateExposure gate={showFreeDeliveryBannerFlag.key} />

      <Navigation />

      <SummerBanner show={showSummerBanner} />
      <StatsigGateExposure gate={showSummerBannerFlag.key} />

      <main className="mx-auto max-w-2xl px-4 pb-16 sm:px-6 sm:pb-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8">
          <ProductHeader />
          <ImageGallery />

          <div className="mt-8 lg:col-span-5">
            <ColorPicker />
            <SizePicker />
            <AddToCartButton />
            <ProductDetails />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
