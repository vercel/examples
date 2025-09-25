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

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?demo-description=Learn%20how%20to%20set%20up%20Growthbook%20flags%20and%20experiments%20using%20Flags%20SDK.&demo-image=%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F694UbhBteRVZOjb8tIECco%2Fd837767128c0832fa23c87279ab81b3f%2Fopengraph-image.jpg&demo-title=Growthbook%20Flags%20SDK%20Example&demo-url=https%3A%2F%2Fgrowthbook-flags-sdk-example.vercel.app%2F&env=FLAGS_SECRET&envDescription=34%20bytes%20with%20%27base64url%27%20encoding&envLink=https%3A%2F%2Fvercel.com%2Fdocs%2Ffeature-flags%2Fflags-explorer%2Freference%23flags_secret-environment-variable&from=templates&products=%255B%257B%2522type%2522%253A%2522integration%2522%252C%2522protocol%2522%253A%2522experimentation%2522%252C%2522productSlug%2522%253A%2522growthbook%2522%252C%2522integrationSlug%2522%253A%2522growthbook%2522%257D%255D&project-name=Growthbook%20Flags%20SDK%20Example&repository-name=growthbook-flags-sdk-example&repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fflags-sdk%2Fgrowthbook&skippable-integrations=1)

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
