import { flag } from 'flags/next'
import { identify } from './lib/identify'
import { OpenFeature, type EvaluationContext } from '@openfeature/server-sdk'
import { createOpenFeatureAdapter } from '@flags-sdk/openfeature'
import { MyFeatureProvider } from './your-custom-provider'

// Async Provider Example
// import { LaunchDarklyProvider } from "@launchdarkly/openfeature-node-server";
// const openFeatureAdapter = createOpenFeatureAdapter(async () => {
//   await OpenFeature.setProviderAndWait(
//     new LaunchDarklyProvider("sdk-3eb98afb-a6ff-4d8c-a648-ddd35cad4140")
//   );
//   return OpenFeature.getClient();
// });

OpenFeature.setProvider(
  new MyFeatureProvider({
    'summer-sale': [false, true],
    'free-delivery': [false, true],
    'proceed-to-checkout-color': ['blue', 'green', 'red', 'red'],
  })
)

const openFeatureAdapter = createOpenFeatureAdapter(OpenFeature.getClient())

export const showSummerBannerFlag = flag<boolean, EvaluationContext>({
  key: 'summer-sale',
  description: 'Shows a bright yellow banner for a 20% discount',
  defaultValue: false,
  identify,
  adapter: openFeatureAdapter.booleanValue(),
})

export const showFreeDeliveryBannerFlag = flag<boolean, EvaluationContext>({
  key: 'free-delivery',
  description: 'Show a black free delivery banner at the top of the page',
  defaultValue: false,
  identify,
  adapter: openFeatureAdapter.booleanValue(),
})

export const proceedToCheckoutColorFlag = flag<string, EvaluationContext>({
  key: 'proceed-to-checkout-color',
  description: 'The color of the proceed to checkout button',
  defaultValue: 'blue',
  options: ['blue', 'green', 'red'],
  identify,
  adapter: openFeatureAdapter.stringValue(),
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
