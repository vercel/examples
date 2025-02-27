# Statsig Flags SDK Example

This example uses [Statsig](https://vercel.com/marketplace/statsig) for feature flags with the [Flags SDK](https://flags-sdk.dev) along with the [Flags Explorer](https://vercel.com/docs/workflow-collaboration/feature-flags/using-vercel-toolbar).

## Demo

[https://flags-sdk-statsig.vercel.app/](https://flags-sdk-statsig.vercel.app/)

## How it works

This demo uses two feature gates on Statsig to control the visibility of two banners on the page.
Both gates are configured to show/hide each banner 50% of the time.

Once you visit the page, you can see a variation of both/one/none of the banners.
Since this example is using a stable id to identify users, you will see the same variation all the time.

To test different variations, you can use the Dev Tools at the bottom to reset the stable id and reload the page.
This allows you to test different variations of the banners.

If you deployed your own and configured the feature gates on Statsig, you can also use the Flags Explorer to test different variations by creating overrides.

## Deploy this template

The easiest way to get started with Statsig is through the native integration in the [Vercel Marketplace](https://vercel.com/marketplace/statsig).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/flags-sdk/experimentation-statsig&env=FLAGS_SECRET&envDescription=The FLAGS_SECRET will be used by the Flags Explorer to securely overwrite feature flags. Must be 32 random bytes, base64-encoded. Use the generated value or set your own.&envLink=https://vercel.com/docs/workflow-collaboration/feature-flags/supporting-feature-flags#flags_secret-environment-variable&project-name=statsig-flags-sdk-example&repository-name=statsig-flags-sdk-example&products=[{\"integrationSlug\":\"statsig\",\"productSlug\":\"statsig\",\"type\":\"integration\",\"protocol\":\"experimentation\"}])

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

### Step 3: Create feature flags on Statsig

Head over to the [Statsig Console](console.statsig.com) and create the two feature flags under Feature Gates:

- `Summer Sale` with the gate id `summer_sale`
- `Free Shipping` with the gate id `free_delivery`

You can also find the gate ids in the `flags.ts` file.

### Step 4: Configure the Feature Gates

Select the `Free Delivery` and `Free Shipping` feature gates and configure them on the Statsig Console.

Create a new rule by clicking on "+ Add New Rule" and set the percentage to 50%.

After that, click on "Save" at the bottom right corner.