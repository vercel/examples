import { flagsmithAdapter } from '@flags-sdk/flagsmith'
import { flag } from 'flags/next'
import { identify } from './lib/identify'
import { IIdentity } from '@flags-sdk/flagsmith'

export const showSummerBannerFlag = flag<boolean, IIdentity>({
  key: 'summer_sale',
  adapter: flagsmithAdapter.booleanValue(),
  defaultValue: false,
  identify,
})

export const showFreeDeliveryBannerFlag = flag<boolean, IIdentity>({
  key: 'free_delivery',
  adapter: flagsmithAdapter.booleanValue(),
  defaultValue: false,
  identify,
})

export const productFlags = [
  showFreeDeliveryBannerFlag,
  showSummerBannerFlag,
] as const
