/** Generated with `npx hypertune` */
import {
  createSource,
  vercelFlagDefinitions,
  flagFallbacks,
  type FlagValues,
  type Context,
} from './generated/hypertune'
import { flag } from 'flags/next'
import { createHypertuneAdapter } from '@flags-sdk/hypertune'
import { identify } from './lib/identify'

const hypertuneAdapter = createHypertuneAdapter<FlagValues, Context>({
  createSource,
  flagDefinitions: vercelFlagDefinitions,
  flagFallbacks,
  identify,
})

export const showSummerBannerFlag = flag(
  hypertuneAdapter.declarations.summerSale
)

export const showFreeDeliveryBannerFlag = flag(
  hypertuneAdapter.declarations.freeDelivery
)

export const proceedToCheckoutColorFlag = flag(
  hypertuneAdapter.declarations.proceedToCheckout
)

export const delayFlag = flag({
  ...hypertuneAdapter.declarations.delay,
  options: [
    { value: 0, label: 'No delay' },
    { value: 1_000, label: '1 second' },
    { value: 2_000, label: '2 seconds' },
    { value: 3_000, label: '3 seconds' },
  ],
})

export const productFlags = [
  showFreeDeliveryBannerFlag,
  showSummerBannerFlag,
] as const
