---
name: LaunchDarkly Integration example
slug: feature-flag-launchdarkly
description: Learn how to set up the LaunchDarkly integration to read flags from Edge Config
framework: Next.js
useCase: Edge Middleware
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/feature-flag-launchdarkly&project-name=feature-flag-launchdarkly&repository-name=feature-flag-launchdarkly&integration-ids=oac_8DFUMlauSkqeQhdGHpL5xbWp&env=NEXT_PUBLIC_LD_CLIENT_SIDE_ID&env=EDGE_CONFIG&edge-config-stores=%7B%22EDGE_CONFIG%22%3A%7B%7D%7D
demoUrl: https://feature-flag-launchdarkly.vercel.app
relatedTemplates:
  - maintenance-page
  - feature-flag-apple-store
---

# feature-flag-launchdarkly example

This example shows how to use the [LaunchDarkly integration](https://vercel.com/integrations/launchdarkly) with Next.js.

> ℹ️ The LaunchDarkly integration requires a LaunchDarkly enterprise account.

You will need to provide the `NEXT_PUBLIC_LD_CLIENT_SIDE_ID` environment variable. Fill it with your client-side ID from LaunchDarkly.

LaunchDarkly wills sync your feature flags into an Edge Config, which you can set in the integration. Note that the same Edge Config also needs to be linked to this project via the `EDGE_CONFIG` environment variable. If you clone this template, this will be set up for you automatically when you select the Edge Config.

## Demo

https://feature-flag-launchdarkly.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/feature-flag-launchdarkly&project-name=feature-flag-launchdarkly&repository-name=feature-flag-launchdarkly&integration-ids=oac_8DFUMlauSkqeQhdGHpL5xbWp&env=NEXT_PUBLIC_LD_CLIENT_SIDE_ID&env=EDGE_CONFIG&edge-config-stores=%7B%22EDGE_CONFIG%22%3A%7B%7D%7D)

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
