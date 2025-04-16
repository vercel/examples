import { bucketAdapter, type Context } from '@flags-sdk/bucket'
import { flag } from 'flags/next'
import { identify } from './lib/identify'

export const showSummerBannerFlag = flag<boolean, Context>({
  key: 'summer_sale',
  adapter: bucketAdapter.featureIsEnabled(),
  defaultValue: false,
  identify,
})

export const showFreeDeliveryBannerFlag = flag<boolean, Context>({
  key: 'free_delivery',
  adapter: bucketAdapter.featureIsEnabled(),
  defaultValue: false,
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
