'use client'

import { toast } from 'sonner'
import { SummerSaleBanner } from '@/components/banners/summer-sale-banner'
import { StatsigGateExposure } from '@/statsig/statsig-gate-exposure'

export function SummerSale({ gate, show }: { show: boolean; gate: string }) {
  return (
    <>
      <StatsigGateExposure gate={gate} />
      {show && (
        <SummerSaleBanner
          onClick={() => {
            // The Statsig Autocapture plugin, will capture the click event
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
