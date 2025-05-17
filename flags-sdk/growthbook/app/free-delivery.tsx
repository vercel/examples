'use client'

import { FreeDeliveryBanner } from '@/components/banners/free-delivery-banner'

export function FreeDelivery({ gate, show }: { show: boolean; gate: string }) {
  return <>{show && <FreeDeliveryBanner />}</>
}
