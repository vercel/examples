# Vercel Flags SDK Example

This example uses [Vercel Flags](https://vercel.com/docs/flags/vercel-flags) for feature flags with the [Flags SDK](https://flags-sdk.dev) along with the `@flags-sdk/vercel` adapter and the [Flags Explorer](https://vercel.com/docs/flags/flags-explorer).

## Demo

[https://flags-sdk-vercel.vercel.app/](https://flags-sdk-vercel.vercel.app/)

## How it works

This demo uses feature flags in Vercel Flags to control the visibility of banners on the page and the color of the checkout button. Flag configurations are managed directly in the Vercel Dashboard.

If you deploy your own and configure the feature flags in the Vercel Dashboard, you can also use the [Flags Explorer](https://vercel.com/docs/flags/flags-explorer) to enable/disable the features locally.

## Deploy this template

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fflags-sdk%2Fvercel&project-name=vercel-flags-sdk-example&repository-name=vercel-flags-sdk-example)

Clicking the button above will:

1. Clone this repository to your GitHub account
2. Create a new Vercel project
3. Deploy immediately (even if you have not configured flags yet)

### Step 1: Link the project

In order to use the Flags Explorer, you need to link the project on your local machine.

```bash
vercel link
```

Select the project from the list you just deployed.

### Step 2: Create Feature Flags in the Vercel Dashboard

Navigate to the **Flags** tab in your Vercel project dashboard and create the following flags:

Feature Flags:

- `summer-sale` - Boolean flag to show/hide the summer sale banner
- `free-delivery` - Boolean flag to show/hide the free delivery banner
- `proceed-to-checkout-color` - String flag with values: `blue`, `green`, `red`

You can also find the feature flag keys in the `flags.ts` file.

### Step 3: Pull all environment variables

This pulls the `FLAGS` environment variable that contains your SDK keys:

```bash
vercel env pull
```

### Step 4: Run the development server

```bash
pnpm install
pnpm dev
```

## Deploy without configuration

If `FLAGS` or `FLAGS_SECRET` are missing, requests are rewritten to `/setup`
until configuration is complete. The setup page includes a checklist and the
required flag keys.

## Local Development

For local development, make sure you have:

1. Linked your project with `vercel link`
2. Pulled environment variables with `vercel env pull`
3. Set `FLAGS_SECRET` in `.env.local` for precompute and secure Flags Explorer overrides

## Learn More

- [Vercel Flags Documentation](https://vercel.com/docs/flags/vercel-flags)
- [Flags SDK Documentation](https://flags-sdk.dev)
- [Flags Explorer Documentation](https://vercel.com/docs/flags/flags-explorer)
