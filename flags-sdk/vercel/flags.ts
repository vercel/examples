import { flag } from 'flags/next'
import { vercelAdapter } from '@flags-sdk/vercel'
import { identify, type Entities } from './lib/identify'

export const showSummerBannerFlag = flag<boolean, Entities>({
  key: 'summer-sale',
  adapter: vercelAdapter(),
  defaultValue: false,
  identify,
  description: 'Show the summer sale banner',
  options: [
    { value: true, label: 'Show' },
    { value: false, label: 'Hide' },
  ],
})

export const showFreeDeliveryBannerFlag = flag<boolean, Entities>({
  key: 'free-delivery',
  adapter: vercelAdapter(),
  defaultValue: false,
  identify,
  description: 'Show the free delivery banner',
  options: [
    { value: true, label: 'Show' },
    { value: false, label: 'Hide' },
  ],
})

export const proceedToCheckoutColorFlag = flag<string, Entities>({
  key: 'proceed-to-checkout-color',
  adapter: vercelAdapter(),
  defaultValue: 'blue',
  identify,
  description: 'Color of the proceed to checkout button',
  options: [
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
    { value: 'red', label: 'Red' },
  ],
})

export const productFlags = [
  showFreeDeliveryBannerFlag,
  showSummerBannerFlag,
  proceedToCheckoutColorFlag,
] as const
