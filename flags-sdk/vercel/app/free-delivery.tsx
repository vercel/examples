'use client'

import { FreeDeliveryBanner } from '@/components/banners/free-delivery-banner'

export function FreeDelivery({ show }: { show: boolean }) {
  return <>{show ? <FreeDeliveryBanner /> : null}</>
}
