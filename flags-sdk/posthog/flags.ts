import { createPostHogAdapter, type PostHogEntities } from '@flags-sdk/posthog'
import { flag } from 'flags/next'
import { identify } from './lib/identify'

const posthogAdapter = createPostHogAdapter({
  postHogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY as string,
  postHogOptions: {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST as string,

  },
})



export const showSummerBannerFlag = flag<boolean, PostHogEntities>({
  key: 'summer_sale',
  adapter: posthogAdapter.isFeatureEnabled(),
  defaultValue: false,
  identify,
})

export const showFreeDeliveryBannerFlag = flag<boolean, PostHogEntities>({
  key: 'free_delivery',
  adapter: posthogAdapter.isFeatureEnabled(),
  defaultValue: false,
  identify,
})

export const productFlags = [
  showFreeDeliveryBannerFlag,
  showSummerBannerFlag,
] as const
