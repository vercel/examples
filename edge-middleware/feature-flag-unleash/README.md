---
name: Feature flags with Unleash
slug: feature-flag-unleash
description: Set up Unleash Proxy for use in Middleware and Server Side Rendering.
framework: Next.js
useCase: Edge Middleware
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/feature-flag-unleash&env=UNLEASH_RELAY_SECRET,UNLEASH_SERVER_API_URL,UNLEASH_SERVER_API_TOKEN&project-name=feature-flag-unleash&repository-name=feature-flag-unleash
demoUrl: https://feature-flag-unleash.vercel.app
---

# Feature Flags with Unleash

Use [Unleash](https://www.getunleash.io/) with Vercel Edge Middleware. This example puts the load of getting feature flag definitions on the Edge Network Cache, decreasing traffic to the Unleash instance.

## Demo

https://feature-flag-unleash.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/feature-flag-unleash&env=UNLEASH_RELAY_SECRET,UNLEASH_SERVER_API_URL,UNLEASH_SERVER_API_TOKEN&project-name=feature-flag-unleash&repository-name=feature-flag-unleash)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/edge-middleware/feature-flag-unleash
# or
yarn create next-app --example https://github.com/vercel/examples/tree/main/edge-middleware/feature-flag-unleash
```

Next, run Next.js in development mode:

```bash
npm install
npm run dev

# or

yarn
yarn dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
