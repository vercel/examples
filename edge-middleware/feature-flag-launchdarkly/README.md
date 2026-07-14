---
name: LaunchDarkly Integration example
slug: feature-flag-launchdarkly
description: Learn how to set up the LaunchDarkly integration to read flags from Edge Config
framework: Next.js
useCase: Edge Middleware
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/feature-flag-launchdarkly&project-name=feature-flag-launchdarkly&repository-name=feature-flag-launchdarkly&env=NEXT_PUBLIC_LD_CLIENT_SIDE_ID&products=%5B%7B%22integrationSlug%22%3A%22launchdarkly%22%2C%22productSlug%22%3A%22launchdarkly%22%2C%22type%22%3A%22integration%22%2C%22protocol%22%3A%22experimentation%22%7D%5D
demoUrl: https://feature-flag-launchdarkly.vercel.app
relatedTemplates:
  - maintenance-page
  - feature-flag-apple-store
---

# feature-flag-launchdarkly example

This example shows how to use the native [LaunchDarkly integration](https://vercel.com/marketplace/launchdarkly) from the Vercel Marketplace with Next.js.

You will need to provide the `NEXT_PUBLIC_LD_CLIENT_SIDE_ID` environment variable. Fill it with your client-side ID from LaunchDarkly.

LaunchDarkly syncs your feature flags into an Edge Config. After installing the LaunchDarkly integration from the Vercel Marketplace, open your LaunchDarkly collection in the Vercel dashboard and turn on the **Enable Edge Config Syncing** toggle. Once enabled, the integration provisions an Edge Config and exposes its connection string as the `EXPERIMENTATION_CONFIG` environment variable, which this example reads to create the Edge Config client.

## Demo

https://feature-flag-launchdarkly.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/feature-flag-launchdarkly&project-name=feature-flag-launchdarkly&repository-name=feature-flag-launchdarkly&env=NEXT_PUBLIC_LD_CLIENT_SIDE_ID&products=%5B%7B%22integrationSlug%22%3A%22launchdarkly%22%2C%22productSlug%22%3A%22launchdarkly%22%2C%22type%22%3A%22integration%22%2C%22protocol%22%3A%22experimentation%22%7D%5D)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/edge-middleware/feature-flag-launchdarkly
```

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
