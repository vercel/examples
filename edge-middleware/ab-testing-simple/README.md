---
name: A/B Testing Simple
slug: ab-testing-simple
description: By A/B testing at the edge, you'll reduce CLS from client-loaded experiments and improve your site's performance with smaller JS bundles.
framework: Next.js
useCase:
  - Edge Middleware
  - Documentation
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/ab-testing-simple&project-name=ab-testing-simple&repository-name=ab-testing-simple
demoUrl: https://edge-functions-ab-testing-simple.vercel.app
relatedTemplates:
  - ab-testing-google-optimize
  - ab-testing-statsig
---

# A/B Testing Simple

By A/B testing at the edge, you'll reduce layout shift from client-loaded experiments and improve your site's performance with smaller JavaScript bundles.

## Demo

https://edge-functions-ab-testing-simple.vercel.app

Since the different variants are generated statically at the edge, it mitigates any potential layout shift that could happen when a variant is inserted into the DOM client side, hence improving your site's performance.

Take a look at [`middleware.ts`](middleware.ts) to see how it works.

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/ab-testing-simple&project-name=ab-testing-simple&repository-name=ab-testing-simple)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/edge-middleware/ab-testing-simple ab-testing-simple
```

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
