import { flag } from 'flags/next'
import { identify } from './lib/identify'
import { flagsmithAdapter } from '@flags-sdk/flagsmith'
import { IIdentity } from '@flags-sdk/flagsmith'


export const showSummerBannerFlag = flag<boolean, IIdentity>({
  key: 'summer-sale',
  description: 'Shows a bright yellow banner for a 20% discount',
  defaultValue: false,
  adapter: flagsmithAdapter.booleanValue(),
  identify,
})

export const showFreeDeliveryBannerFlag = flag<boolean, IIdentity>({
  key: 'free-delivery',
  description: 'Show a black free delivery banner at the top of the page',
  defaultValue: false,
  identify,
  adapter: flagsmithAdapter.booleanValue(),
})

export const proceedToCheckoutColorFlag = flag<string, IIdentity>({
  key: 'proceed-to-checkout-color',
  description: 'The color of the proceed to checkout button',
  defaultValue: 'blue',
  options: ['blue', 'green', 'red'],
  identify,
  adapter: flagsmithAdapter.stringValue(),
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
  proceedToCheckoutColorFlag,
] as const
