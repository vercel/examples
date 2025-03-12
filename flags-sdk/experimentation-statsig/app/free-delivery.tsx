'use client'

import { FreeDeliveryBanner } from '@/components/banners/free-delivery-banner'
import { StatsigGateExposure } from '@/statsig/statsig-gate-exposure'

export function FreeDelivery({ gate, show }: { gate: string; show: boolean }) {
  return (
    <>
      <StatsigGateExposure gate={gate} />
      {show ? <FreeDeliveryBanner /> : null}
    </>
  )
}
