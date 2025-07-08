# flagsmith Flags SDK Example

This example uses [flagsmith](https://flagsmith.com/) for feature flags with the [Flags SDK](https://flags-sdk.dev) and the [Flags SDK flagsmith adapter](https://flags-sdk.dev/docs/api-reference/adapters/flagsmith) along with the [Flags Explorer](https://vercel.com/docs/workflow-collaboration/feature-flags/using-vercel-toolbar).

## Demo

[https://flags-sdk-flagsmith.vercel.app/](https://flags-sdk-flagsmith.vercel.app/)

## How it works

This demo uses two feature flags defined in code control the visibility of two banners on the page.
Both flags are configured to show/hide each banner 50% of the time.

Once you visit the page, you can see a variation of both/one/none of the banners.
Since this example is using a stable id to identify users, you will see the same variation until you reset your id.

To test different variations, you can use the Dev Tools at the bottom to reset the stable id and reload the page.
This allows you to test different variations of the banners.

If you deployed your own instance of this example you can also use the [Flags Explorer](https://vercel.com/docs/workflow-collaboration/feature-flags/using-vercel-toolbar) to test different variations by creating overrides.

## Deploy this template

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fflags-sdk%2Fflagsmith&env=FLAGS_SECRET&envDescription=The+FLAGS_SECRET+will+be+used+by+the+Flags+Explorer+to+securely+overwrite+feature+flags.+Must+be+32+random+bytes%2C+base64-encoded.+Use+the+generated+value+or+set+your+own.&envLink=https%3A%2F%2Fvercel.com%2Fdocs%2Fworkflow-collaboration%2Ffeature-flags%2Fsupporting-feature-flags%23flags_secret-environment-variable&project-name=flagsmith-flags-sdk-example&repository-name=flagsmith-flags-sdk-example)

### Step 1: Link the project

First, install the latest version of the Vercel CLI:

```bash
pnpm i -g vercel
```

or

```bash
npm i -g vercel
```

To use the Flags Explorer, you need to connect your local project to your Vercel project:

```bash
vercel link
```

Select the project from the list you just deployed.

### Step 2: Pull all environment variables

This allows the Flags SDK and the Flags Explorer to work correctly, by getting additional metadata.

```bash
vercel env pull
```

Step 3: Create Feature Flags
Head over to Flagsmith dashboard and create the feature flags required by this template.

Feature Flags:

Summer Sale with the key summer-sale
Free Shipping with the key free-delivery
Proceed To Checkout with the key proceed-to-checkout-color
You can also find the feature flag keys in the flags.ts file.

Set both feature flags to rollout to 50% of users.
