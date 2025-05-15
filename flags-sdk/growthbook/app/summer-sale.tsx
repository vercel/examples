'use client'

import { toast } from 'sonner'
import { SummerSaleBanner } from '@/components/banners/summer-sale-banner'

export function SummerSale({ show }: { show: boolean }) {
  return (
    <>
      {show && (
        <SummerSaleBanner
          onClick={() => {
            toast('End reached', {
              className: 'my-classname',
              description:
                'The summer sale is not implemented in this template. Try adding to the cart instead.',
            })
          }}
        />
      )}
    </>
  )
}
