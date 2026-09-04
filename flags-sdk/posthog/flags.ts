import { type PostHogEntities, postHogAdapter } from '@flags-sdk/posthog'
import { flag } from 'flags/next'
import { identify } from './lib/identify'

export const showSummerBannerFlag = flag<boolean, PostHogEntities>({
  key: 'summer_sale',
  adapter: postHogAdapter,
  defaultValue: false,
  identify,
})

export const showFreeDeliveryBannerFlag = flag<boolean, PostHogEntities>({
  key: 'free_delivery',
  adapter: postHogAdapter,
  defaultValue: false,
  identify,
})

export const proceedToCheckoutColorFlag = flag<string, PostHogEntities>({
  key: 'proceed_to_checkout_color',
  adapter: postHogAdapter.payload,
  defaultValue: 'blue',
  options: ['blue', 'green', 'red'],
  identify,
})

export const productFlags = [
  showFreeDeliveryBannerFlag,
  showSummerBannerFlag,
  proceedToCheckoutColorFlag,
] as const
