# Growthbook Flags SDK Example

This example uses GrowthBook for feature flags with the [Flags SDK](https://flags-sdk.dev) along with the `@flags-sdk/growthbook` [GrowthBook adapter](https://flags-sdk.dev/providers/growthbook) and the [Flags Explorer](https://vercel.com/docs/workflow-collaboration/feature-flags/using-vercel-toolbar).

## Demo

[https://flags-sdk-growthbook.vercel.app](https://flags-sdk-growthbook.vercel.app)

## How it works

This demo controls the visibility of two banners on the home page, and the color of the checkout button.

Once you visit the page, you can see a variation of both/one/none of the banners.

To test different variations, you can use the Dev Tools at the bottom to reset the stable id and reload the page.

When you create and link a project on Vercel, you may use the [Flags Explorer](https://vercel.com/docs/workflow-collaboration/feature-flags/using-vercel-toolbar) to see what variants are active, and test different variations by creating overrides.

## Deploy this template

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fflags-sdk%2Fgrowthbook&env=GROWTHBOOK_CLIENT_KEY&env=FLAGS_SECRET&envDescription=The+FLAGS_SECRET+will+be+used+by+the+Flags+Explorer+to+securely+overwrite+feature+flags.+Must+be+32+random+bytes%2C+base64-encoded.+Use+the+generated+value+or+set+your+own.&envLink=https%3A%2F%2Fvercel.com%2Fdocs%2Fworkflow-collaboration%2Ffeature-flags%2Fsupporting-feature-flags%23flags_secret-environment-variable&project-name=flags-sdk-growthbook-example&repository-name=flags-sdk-growthbook-example)

### Step 1: Link the project

In order to use the Flags Explorer, you need to link the project on your local machine.

```bash
vercel link
```

If your project does not exist yet, you will be prompted to create it.

### Step 2: Pull all environment variables

This allows the Flags SDK and the Flags Explorer to work correctly, by getting additional metadata.

```bash
vercel env pull
```

If you are building this on the CLI, you can set the environment variables with `vercel env add`

### Step 3: Create Feature Gates and Experiments

On GrowthBook, create a project with the following flags split by `id`:

- `free_delivery` (50% rollout or experiment)
- `summer_sale` (50% rollout or experiment)
- `proceed_to_checkout` (Multiple variants serving `red`, `green` or `blue`)

The id of the flags in GrowthBook should match the key of the flags in the `flags.ts` file.

If you have not started your experiments yet, you must do so in order to see the traffic split.
