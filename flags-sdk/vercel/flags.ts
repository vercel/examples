import { flag } from 'flags/next'
import { createVercelAdapter } from '@flags-sdk/vercel'
import { identify, type Entities } from './lib/identify'

if (!process.env.FLAGS) {
  throw new Error(
    'Missing Vercel Flags SDK key. Set FLAGS by linking your project and running `vercel env pull`.'
  )
}

const vercelFlagsAdapter = createVercelAdapter(process.env.FLAGS)

export const showSummerBannerFlag = flag<boolean, Entities>({
  key: 'summer-sale',
  adapter: vercelFlagsAdapter(),
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
  adapter: vercelFlagsAdapter(),
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
  adapter: vercelFlagsAdapter(),
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
