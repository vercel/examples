import { postHogAdapter, type PostHogEntities } from '@flags-sdk/posthog'
import { flag } from 'flags/next'
import { identify } from './lib/identify'

export const showSummerBannerFlag = flag<boolean, PostHogEntities>({
  key: 'summer_sale',
  adapter: postHogAdapter.isFeatureEnabled(),
  defaultValue: false,
  identify,
})

export const showFreeDeliveryBannerFlag = flag<boolean, PostHogEntities>({
  key: 'free_delivery',
  adapter: postHogAdapter.isFeatureEnabled(),
  defaultValue: false,
  identify,
})

export const productFlags = [
  showFreeDeliveryBannerFlag,
  showSummerBannerFlag,
] as const
