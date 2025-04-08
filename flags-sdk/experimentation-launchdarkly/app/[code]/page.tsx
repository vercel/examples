import { SummerSale } from '@/app/summer-sale'
import { ImageGallery } from '@/components/image-gallery'
import { ProductDetails } from '@/components/product-detail-page/product-details'
import { ProductHeader } from '@/components/product-detail-page/product-header'
import { AddToCart } from '@/app/[code]/add-to-cart'
import { ColorPicker } from '@/components/product-detail-page/color-picker'
import { SizePicker } from '@/components/product-detail-page/size-picker'
import { ProductDetailPageProvider } from '@/components/utils/product-detail-page-context'

import { productFlags, showSummerBannerFlag } from '@/flags'
import { Main } from '@/components/main'

export default async function Page(props: {
  params: Promise<{ code: string }>
}) {
  const params = await props.params;
  const showSummerBanner = await showSummerBannerFlag(params.code, productFlags);

  return (
    <ProductDetailPageProvider>
      <SummerSale show={showSummerBanner} flagKey={showSummerBannerFlag.key} />
      <Main>
        <div className="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8">
          <ProductHeader />
          <ImageGallery />

          <div className="mt-8 lg:col-span-5">
            <ColorPicker />
            <SizePicker />
            <AddToCart />
            <ProductDetails />
          </div>
        </div>
      </Main>
    </ProductDetailPageProvider>
  );
}
