# LaunchDarkly Flags SDK Example

This example uses [LaunchDarkly](https://vercel.com/marketplace/launchdarkly) for feature flags with the [Flags SDK](https://flags-sdk.dev) along with the `@flags-sdk/launchdarkly` [LaunchDarkly adapter](https://flags-sdk.dev/docs/api-reference/adapters/launchdarkly) and the [Flags Explorer](https://vercel.com/docs/workflow-collaboration/feature-flags/using-vercel-toolbar).

## Demo

https://flags-sdk-launchdarkly.vercel.app/

## How it works

This demo uses two feature flags on LaunchDarkly to control the visibility of two banners on the page.
Both flags are configured to show/hide each banner 50% of the time.

Once you visit the page, you can see a variation of both/one/none of the banners.
Since this example is using a stable id to identify users, you will see the same variation until you reset your id.

To test different variations, you can use the Dev Tools at the bottom to reset the stable id and reload the page.
This allows you to test different variations of the banners.

If you deployed your own and configured the feature flags on LaunchDarkly, you can also use the [Flags Explorer](https://vercel.com/docs/workflow-collaboration/feature-flags/using-vercel-toolbar) to test different variations by creating overrides.

## Deploy this template

The easiest way to get started with LaunchDarkly is through the integration in [Vercel Marketplace](https://vercel.com/marketplace/launchdarkly).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fflags-sdk%2Flaunchdarkly&env=FLAGS_SECRET&envDescription=The+FLAGS_SECRET+will+be+used+by+the+Flags+Explorer+to+securely+overwrite+feature+flags.+Must+be+32+random+bytes%2C+base64-encoded.+Use+the+generated+value+or+set+your+own.&envLink=https%3A%2F%2Fvercel.com%2Fdocs%2Fworkflow-collaboration%2Ffeature-flags%2Fsupporting-feature-flags%23flags_secret-environment-variable&project-name=launchdarkly-flags-sdk&repository-name=launchdarkly-flags-sdk)

### Step 1: Link the project

In order to use the Flags Explorer, you need to link the project on your local machine.

```bash
vercel link
```

Select the project from the list you just deployed.

### Step 2: Pull all environment variables

This allows the Flags SDK and the Flags Explorer to work correctly, by getting additional metadata.

```bash
vercel env pull
```

### Step 3: Create Feature Flags

Head over to the [LaunchDarkly Console](https://app.launchdarkly.com) and create the feature flags and experiments required by this template.

Be sure to enable the `SDKs using Client-side ID` option for each Feature Flag.

Feature Flags:

- `Summer Sale` (type boolean) with the key `summer-sale` and the variations `true` and `false`. Edit the default targeting rule to serve a percentage rollout with a 50/50 split by `user.key`.
- `Free Delivery` (type boolean) with the key `free-delivery` and the variations `true` and `false`. Edit the default targeting rule to serve a percentage rollout with a 50/50 split by `user.key`.
- `Proceed to Checkout` (type string) with the key `proceed-to-checkout` and the following variations:
  - Name: `Control`, Value: `blue`
  - Name: `Test`, Value: `green`
  - Name: `Test #2`, Value: `red`

You can also find the flag keys in the `flags.ts` file.

Ensure all Flags are ON.

### Step 4: Configure the Experiment

Create the `Proceed to Checkout` experiment:

- Name: `Proceed to Checkout`
- Hypothesis: `Button color influences rate at which customers proceed to checkout`
- Type: `Feature change`
- Randomization Unit: `user`
- Randomization Attribute: `key`
- Metric: Create a new metric:
  - Event kind: `Custom`
  - Event key: `proceed-to-checkout-clicked`
  - What do you want to measure? `Occurence (conversion: binary)`
  - Metric definition: `Percentage of user units that sent the event, where higher is better`
  - Metric name: `Proceed to Checkout Clicked`
- Varaiations: Choose flag `proceed-to-checkout`
- Audience:
  - In this experiment: Choose `Custom` and enter `100`%
  - Split audience: Choose `Split equally`
- Statistical approach: Default values

After that, start the Experiment.

### Step 6: Set environment variables

See `.env.example` for a template.

- [`FLAGS_SECRET`](https://vercel.com/docs/feature-flags/flags-explorer/reference#flags_secret-environment-variable)
- `EDGE_CONFIG` (Vercel Edge Config connection string)
- `LAUNCHDARKLY_PROJECT_SLUG`
- `LAUNCHDARKLY_CLIENT_SIDE_ID`
- `NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_SIDE_ID` (set to same value as `LAUNCHDARKLY_CLIENT_SIDE_ID`)

_(Optional)_ If you provide the `LAUNCHDARKLY_API_KEY`, `LAUNCHDARKLY_PROJECT_KEY` and `LAUNCHDARKLY_ENVIRONMENT` environment variables, the Flags Explorer will fetch additional metadata from the LaunchDarkly API.

This will show the description (if set) and displays a link to the feature flag on the LaunchDarkly Console.

You can create an API key and find project and environment values in the [LaunchDarkly Console](https://app.launchdarkly.com/settings/projects).
