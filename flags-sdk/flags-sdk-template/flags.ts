import { flag } from 'flags/next'
import { identify } from './lib/identify'
import { templateAdapter, type TemplateEntities } from './template-adapter'

export const showSummerBannerFlag = flag<boolean, TemplateEntities>({
  key: 'summer_sale',
  adapter: templateAdapter.rollout(50),
  defaultValue: true,
  identify,
})

export const showFreeDeliveryBannerFlag = flag<boolean, TemplateEntities>({
  key: 'free_delivery',
  adapter: templateAdapter.rollout(50),
  defaultValue: false,
  identify,
})

export const proceedToCheckoutColorFlag = flag<string, TemplateEntities>({
  key: 'proceed_to_checkout',
  adapter: templateAdapter.multivariant(['blue', 'green', 'red']),
  description: 'The color of the proceed to checkout button',
  defaultValue: 'blue',
  options: ['blue', 'green', 'red'],
  identify,
})

export const delayFlag = flag<number, TemplateEntities>({
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
