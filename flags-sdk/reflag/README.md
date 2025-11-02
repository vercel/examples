# Reflag Flags SDK Example

This example uses [Reflag](https://reflag.com) for feature flags with the [Flags SDK](https://flags-sdk.dev) along with the `@flags-sdk/reflag` [Reflag adapter](https://flags-sdk.dev/docs/api-reference/adapters/reflag) and the [Flags Explorer](https://vercel.com/docs/workflow-collaboration/feature-flags/using-vercel-toolbar).

## Demo

[https://flags-sdk-reflag.vercel.app/](https://flags-sdk-reflag.vercel.app/)

## How it works

This demo uses two features on Reflag to control the visibility of two banners on the page.
Both gates are configured to show/hide each banner 50% of the time.

If you deployed your own and configured the features on Reflag, you can also use the [Flags Explorer](https://vercel.com/docs/workflow-collaboration/feature-flags/using-vercel-toolbar) to enabled/disabled the features.

## Deploy this template

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fflags-sdk/reflag&env=FLAGS_SECRET&envDescription=The+FLAGS_SECRET+will+be+used+by+the+Flags+Explorer+to+securely+overwrite+feature+flags.+Must+be+32+random+bytes%2C+base64-encoded.+Use+the+generated+value+or+set+your+own.&envLink=https%3A%2F%2Fvercel.com%2Fdocs%2Fworkflow-collaboration%2Ffeature-flags%2Fsupporting-feature-flags%23flags_secret-environment-variable&project-name=reflag-flags-sdk-example&repository-name=reflag-flags-sdk-example)

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

### Step 3: Create Features

Head over to the [Reflag application](app.reflag.com) and create the features required by this template.

Features:

- `Summer Sale` with the feature key `summer_sale`
- `Free Shipping` with the feature key `free_delivery`

You can also find the feature keys in the `flags.ts` file.

### Step 4: Configure the Features

Select the `Summer Sale` and `Free Shipping` features and configure them on the Reflag Console.

Create a new rule by clicking on "+ Add Rule" and set the percentage to 50%.

After that, click on "Save".
