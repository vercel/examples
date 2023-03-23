---
name: Rewriting at the Edge using Upstash
slug: edge-rewrites-upstash
description: Learn how to avoid calling several services by pre-checking stock at the edge using a redis cache.
framework: Next.js
useCase: Edge Middleware
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/rewrites-upstash&project-name=rewrites-upstash&repository-name=rewrites-upstash
demoUrl: https://edge-rewrites-upstash.vercel.app
relatedTemplates:
  - ab-testing-simple
---

# Rewrites with Upstash

This example shows how to avoid calling several services by pre-checking stock at the edge using a redis cache ([Upstash](https://upstash.com/)).

## Demo

https://edge-rewrites-upstash.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/rewrites-upstash&project-name=rewrites-upstash&repository-name=rewrites-upstash)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/edge-middleware/rewrites-upstash rewrites-upstash
```

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
