import { statsigAdapter, type StatsigUser } from '@flags-sdk/statsig'
import { flag } from 'flags/next'
import { identify } from './lib/identify'

export const showSummerBannerFlag = flag<boolean, StatsigUser>({
  key: 'summer_sale',
  adapter: statsigAdapter.featureGate((gate) => gate.value),
  defaultValue: false,
  identify,
})

export const showFreeDeliveryBannerFlag = flag<boolean, StatsigUser>({
  key: 'free_delivery',
  adapter: statsigAdapter.featureGate((gate) => gate.value),
  defaultValue: false,
  identify,
})

export const proceedToCheckoutColorFlag = flag<string, StatsigUser>({
  key: 'proceed_to_checkout',
  adapter: statsigAdapter.experiment<string>((gate) =>
    gate.get('color', 'blue')
  ),
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
