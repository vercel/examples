'use client'

import { colorToImage, images } from '@/components/utils/images'
import { useProductDetailPageContext } from '@/components/utils/product-detail-page-context'
import clsx from 'clsx'
import Image from 'next/image'

export function ImageGallery() {
  const { color } = useProductDetailPageContext()

  const orderedImages = [...images].sort((a, b) => {
    if (a === colorToImage[color]) return -1
    if (b === colorToImage[color]) return 1
    return 0
  })

  return (
    <div className="mt-8 lg:col-span-7 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-3 lg:gap-8">
        {orderedImages.map((image, index) => (
          <Image
            key={index}
            alt="Product Image"
            src={image}
            className={clsx(
              index === 0 ? 'lg:col-span-2 lg:row-span-2' : 'hidden lg:block',
              'rounded-xl border border-gray-200'
            )}
          />
        ))}
      </div>
    </div>
  )
}
