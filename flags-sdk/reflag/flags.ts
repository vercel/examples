import { reflagAdapter, type Context } from '@flags-sdk/reflag'
import { flag } from 'flags/next'
import { identify } from './lib/identify'

export const showSummerBannerFlag = flag<boolean, Context>({
  key: 'summer_sale',
  adapter: reflagAdapter.isEnabled(),
  defaultValue: false,
  identify,
})

export const showFreeDeliveryBannerFlag = flag<boolean, Context>({
  key: 'free_delivery',
  adapter: reflagAdapter.isEnabled(),
  defaultValue: false,
  identify,
})

export const productFlags = [
  showFreeDeliveryBannerFlag,
  showSummerBannerFlag,
] as const
