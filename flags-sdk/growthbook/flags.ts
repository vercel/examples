import { growthbookAdapter, type Attributes } from '@flags-sdk/growthbook'
import { flag } from 'flags/next'
import { identify } from './lib/identify'
import { after } from 'next/server'

// Initialize GrowthBook server-side tracking
// Note: if using client-side tracking you do not need to set this.
growthbookAdapter.setTrackingCallback((experiment, result) => {
  // Safely fire and forget async calls
  after(async () => {
    console.log('Viewed Experiment (server-side tracking)', {
      experimentId: experiment.key,
      variationId: result.key,
    })
  })
})

export const showSummerBannerFlag = flag<boolean, Attributes>({
  key: 'summer_sale',
  adapter: growthbookAdapter.feature<boolean>(),
  defaultValue: false,
  identify,
})

export const showFreeDeliveryBannerFlag = flag<boolean, Attributes>({
  key: 'free_delivery',
  adapter: growthbookAdapter.feature<boolean>(),
  defaultValue: false,
  identify,
})

export const proceedToCheckoutColorFlag = flag<string, Attributes>({
  key: 'proceed_to_checkout',
  adapter: growthbookAdapter.feature<string>(),
  description: 'The color of the proceed to checkout button',
  defaultValue: 'blue',
  options: ['blue', 'green', 'red'],
  identify,
})

export const delayFlag = flag<number>({
  key: 'delay',
  defaultValue: 0,
  description:
    'A flag for debugging and demo purposes which delays the data loading',
  options: [
    { value: 0, label: 'No delay' },
    { value: 200, label: '200ms' },
    { value: 1000, label: '1s' },
    { value: 3000, label: '3s' },
    { value: 10_000, label: '10s' },
  ],
  decide() {
    return this.defaultValue as number
  },
})

export const productFlags = [
  showFreeDeliveryBannerFlag,
  showSummerBannerFlag,
] as const
