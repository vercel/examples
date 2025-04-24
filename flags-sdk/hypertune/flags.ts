import {
  createSource,
  flagFallbacks,
  vercelFlagDefinitions,
  type Context,
  type FlagValues,
} from './generated/hypertune'
import { createHypertuneFlagFactory } from '@flags-sdk/hypertune'
import { identify } from './lib/identify'

const hypertuneFlag = createHypertuneFlagFactory<FlagValues, Context>({
  createSource,
  flagFallbacks,
  flagDefinitions: vercelFlagDefinitions,
  identify,
})

export const showSummerBannerFlag = hypertuneFlag('summerSale')

export const showFreeDeliveryBannerFlag = hypertuneFlag('freeDelivery')

export const proceedToCheckoutColorFlag = hypertuneFlag('proceedToCheckout')

export const delayFlag = hypertuneFlag('delay')

export const productFlags = [
  showFreeDeliveryBannerFlag,
  showSummerBannerFlag,
] as const
