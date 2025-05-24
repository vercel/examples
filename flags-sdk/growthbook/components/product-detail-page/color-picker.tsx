'use client'

import { useProductDetailPageContext } from '@/components/utils/product-detail-page-context'
import { Radio, RadioGroup } from '@headlessui/react'
import clsx from 'clsx'

const colors = [
  { name: 'Black', bgColor: 'bg-gray-900', selectedColor: 'ring-gray-900' },
  { name: 'White', bgColor: 'bg-white', selectedColor: 'ring-gray-300' },
  { name: 'Blue', bgColor: 'bg-blue-500', selectedColor: 'ring-blue-500' },
]

export function ColorPicker() {
  const { color, setColor } = useProductDetailPageContext()
  const selectedColor = colors.find((c) => c.name === color) || colors[0]

  return (
    <div>
      <h2 className="text-sm font-medium text-gray-900">Color</h2>
      <fieldset aria-label="Choose a color" className="mt-2">
        <RadioGroup
          value={selectedColor}
          onChange={(newColor) => setColor(newColor.name)}
          className="flex items-center gap-x-3"
        >
          {colors.map((color) => (
            <Radio
              key={color.name}
              value={color}
              aria-label={color.name}
              className={clsx(
                color.selectedColor,
                'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-hidden data-checked:ring-2 data-focus:data-checked:ring-3 data-focus:data-checked:ring-offset-1'
              )}
            >
              <span
                aria-hidden="true"
                className={clsx(
                  color.bgColor,
                  'size-8 rounded-full border border-black/10'
                )}
              />
            </Radio>
          ))}
        </RadioGroup>
      </fieldset>
    </div>
  )
}
