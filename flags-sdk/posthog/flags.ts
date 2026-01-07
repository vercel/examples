import { type PostHogEntities } from '@flags-sdk/posthog'
import { flag } from 'flags/next'
import { identify } from './lib/identify'
import { postHogAdapter } from './lib/posthog-adapter'
import type { Adapter } from 'flags'

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

export const proceedToCheckoutColorFlag = flag<string, PostHogEntities>({
  key: 'proceed_to_checkout_color',
  // This is a limitation in the PostHog adapter which does not take generic type
  adapter: postHogAdapter.featureFlagValue() as Adapter<
    string,
    PostHogEntities
  >,
  defaultValue: 'blue',
  options: ['blue', 'green', 'red'],
  identify,
})

export const productFlags = [
  showFreeDeliveryBannerFlag,
  showSummerBannerFlag,
  proceedToCheckoutColorFlag,
] as const
