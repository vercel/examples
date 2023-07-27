---
name: A/B Testing with Split
slug: ab-testing-split
description: Learn to use Split, a feature delivery platform that powers feature flag management, software experimentation and continuous delivery.
framework: Next.js
useCase: Edge Middleware
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/feature-flag-split&env=SPLIT_EDGE_CONFIG_ITEM_KEY,SPLIT_SDK_KEY&project-name=feature-flag-split&repository-name=feature-flag-split
demoUrl: https://edge-functions-feature-flag-split.vercel.app
relatedTemplates:
  - ab-testing-simple
---

# A/B Testing with Split

[Split](https://www.split.io/) is a feature delivery platform that powers feature flag management, software experimentation and continuous delivery.

This example shows how to use feature flags with Split, leveraging Edge Config and Edge Middleware. Synchronize your feature flags into Edge Config with the [Split integration](https://vercel.com/integrations/split), and then instruct the Split SDK to consume directly from there, with low-latency, instead of fetching from the cloud.

## Demo

https://edge-functions-feature-flag-split.vercel.app

## How to Use

Before using this repository, you will need a [Split account](https://www.split.io/signup/) to set up feature flags and obtain a Split SDK Key. You will also need to [set up the Split's Vercel integration](https://vercel.com/integrations/split), that will allow your feature flags to be stored and updated in a Vercel Edge Config instance connected to your project.

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/feature-flag-split&env=SPLIT_EDGE_CONFIG_ITEM_KEY,SPLIT_SDK_KEY&project-name=feature-flag-split&repository-name=feature-flag-split)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/edge-middleware/feature-flag-split feature-flag-split
```

Once that's done, copy the `.env.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.example .env.local
```

Then open `.env.local` and set the required environment variables:

- `SPLIT_SDK_KEY` should be available under Workspace settings - API Keys, in the Admin settings of your Split organization.
- `SPLIT_EDGE_CONFIG_ITEM_KEY` must match the name of the Edge Config item key you set during the Split's Vercel integration setup.
- `EDGE_CONFIG` is the connection string URL to access the Edge Config instance of your project. See [_Using a connection string_](https://vercel.com/docs/storage/edge-config/using-edge-config#using-a-connection-string) for more information.

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
