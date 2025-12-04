import { flagsmithAdapter } from '@flags-sdk/flagsmith'
import { flag } from 'flags/next'
import { identify } from './lib/identify'

export const showSummerBannerFlag = flag<boolean>({
  key: 'summer_sale',
  adapter: flagsmithAdapter.getValue({ coerce: 'boolean' }),
  defaultValue: false,
  identify,
})

export const showFreeDeliveryBannerFlag = flag<boolean>({
  key: 'free_delivery',
  adapter: flagsmithAdapter.getValue({ coerce: 'boolean' }),
  defaultValue: false,
  identify,
})

export const proceedToCheckoutColorFlag = flag<string>({
  key: 'proceed_to_checkout_color',
  adapter: flagsmithAdapter.getValue({ coerce: 'string' }),
  defaultValue: 'blue',
  options: ['blue', 'green', 'red'],
  identify,
})

export const productFlags = [
  showFreeDeliveryBannerFlag,
  showSummerBannerFlag,
  proceedToCheckoutColorFlag,
] as const
