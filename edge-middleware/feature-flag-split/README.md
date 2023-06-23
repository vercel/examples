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

This example shows how to use feature flags with Split, leveraging Edge Config and Edge Middleware.

## Demo

https://edge-functions-feature-flag-split.vercel.app

## How to Use

Before using this repository, you need an [Split account](https://www.split.io/signup/) to set up feature flags and obtain the Split SDK Key. Also follow the section [Set up the Split's Vercel integration](https://help.split.io/hc/en-us/articles/16469873148173#set-up-the-splits-vercel-integration) to get your feature flags synchronized in Vercel Edge Config data store.

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

Then open `.env.local` and set the environment variables to match the ones in your Split dashboard. Your keys should be available under Workspace settings - API Keys, in the admin settings of your organization.

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
