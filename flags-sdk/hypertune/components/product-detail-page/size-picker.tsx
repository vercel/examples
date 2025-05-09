'use client'

import { Radio, RadioGroup } from '@headlessui/react'
import clsx from 'clsx'
import { useProductDetailPageContext } from '@/components/utils/product-detail-page-context'

const sizes = [
  { name: 'XXS', inStock: true },
  { name: 'XS', inStock: true },
  { name: 'S', inStock: true },
  { name: 'M', inStock: true },
  { name: 'L', inStock: true },
  { name: 'XL', inStock: false },
]

export function SizePicker() {
  const { size, setSize } = useProductDetailPageContext()
  const selectedSize = sizes.find((s) => s.name === size) || sizes[0]

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-900">Size</h2>
      </div>

      <fieldset aria-label="Choose a size" className="mt-2">
        <RadioGroup
          value={selectedSize}
          onChange={(newSize) => setSize(newSize.name)}
          className="grid grid-cols-3 gap-3 sm:grid-cols-6"
        >
          {sizes.map((size) => (
            <Radio
              key={size.name}
              value={size}
              disabled={!size.inStock}
              className={clsx(
                size.inStock
                  ? 'cursor-pointer focus:outline-hidden'
                  : 'cursor-not-allowed opacity-50',
                'flex items-center justify-center rounded-full border border-gray-200 bg-white px-3 py-3 text-sm font-medium text-gray-900 uppercase hover:bg-gray-50 data-checked:border-transparent data-checked:bg-blue-600 data-checked:text-white data-checked:hover:bg-blue-700 data-focus:ring-2 data-focus:ring-blue-500 data-focus:ring-offset-2 sm:flex-1'
              )}
            >
              {size.name}
            </Radio>
          ))}
        </RadioGroup>
      </fieldset>
    </div>
  )
}
