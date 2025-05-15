# Statsig Flags SDK Example

This example uses [Statsig](https://vercel.com/marketplace/statsig) for feature flags with the [Flags SDK](https://flags-sdk.dev) along with the `@flags-sdk/statsig` [Statsig adapter](https://flags-sdk.dev/docs/api-reference/adapters/statsig) and the [Flags Explorer](https://vercel.com/docs/workflow-collaboration/feature-flags/using-vercel-toolbar).

## Demo

[https://flags-sdk-statsig.vercel.app/](https://flags-sdk-statsig.vercel.app/)

## How it works

This demo uses two feature gates on Statsig to control the visibility of two banners on the page.
Both gates are configured to show/hide each banner 50% of the time.

Once you visit the page, you can see a variation of both/one/none of the banners.
Since this example is using a stable id to identify users, you will see the same variation until you reset your id.

To test different variations, you can use the Dev Tools at the bottom to reset the stable id and reload the page.
This allows you to test different variations of the banners.

If you deployed your own and configured the feature gates on Statsig, you can also use the [Flags Explorer](https://vercel.com/docs/workflow-collaboration/feature-flags/using-vercel-toolbar) to test different variations by creating overrides.

## Deploy this template

The easiest way to get started with Statsig is through the native integration in the [Vercel Marketplace](https://vercel.com/marketplace/statsig).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fflags-sdk%2Fexperimentation-statsig&env=FLAGS_SECRET&envDescription=The+FLAGS_SECRET+will+be+used+by+the+Flags+Explorer+to+securely+overwrite+feature+flags.+Must+be+32+random+bytes%2C+base64-encoded.+Use+the+generated+value+or+set+your+own.&envLink=https%3A%2F%2Fvercel.com%2Fdocs%2Fworkflow-collaboration%2Ffeature-flags%2Fsupporting-feature-flags%23flags_secret-environment-variable&project-name=statsig-flags-sdk-example&repository-name=statsig-flags-sdk-example&products=%5B%7B%22integrationSlug%22%3A%22statsig%22%2C%22productSlug%22%3A%22statsig%22%2C%22type%22%3A%22integration%22%2C%22protocol%22%3A%22experimentation%22%7D%5D)

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

### Step 3: Create Feature Gates and Experiments

Head over to the [Statsig Console](console.statsig.com) and create the feature gates and experiments required by this template.

Ensure you select `Stable ID` instead of `User ID` when creating the gates and experiments.

Feature Gates:

- `Summer Sale` with the gate id `summer_sale`, targeting the `Stable ID`
- `Free Shipping` with the gate id `free_delivery`, targeting the `Stable ID`

Experiments:

- `Proceed to Checkout` with the id `proceed_to_checkout`, targeting the `Stable ID`

You can also find the gate ids in the `flags.ts` file.

### Step 4: Configure the Feature Gates

Select the `Summer Sale` and `Free Shipping` feature gates and configure them on the Statsig Console.

Create a new rule by clicking on "+ Add New Rule" and set the percentage to 50%.

After that, click on "Save" at the bottom right corner.

### Step 5: Configure the Experiments

Configure the `Proceed to Checkout` experiment:

- Besides the default `Control` and `Test` groups, add a new group called `Test #2`
- Add a parameter called `color` of type `string`
- Use `blue`, `green` and `red` as the values for the different groups

After that, start the Experiment.

### Step 6 (optional): Set additional environment variables

If you provide the `STATSIG_CONSOLE_API_KEY` and `STATSIG_PROJECT_ID` environment variables, the Flags Explorer will fetch additional metadata from the Statsig API.

This will show the description (if set) and displays a link to the feature gate on the Statsig Console.

You can find both values in the [Statsig Console](https://console.statsig.com/settings/project).
