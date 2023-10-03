---
name: A/B Testing with Google Optimize
slug: ab-testing-google-optimize
description: Learn to use Google Optimize as an A/B testing solution for experimentation at the edge.
framework: Next.js
useCase: Edge Middleware
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/ab-testing-google-optimize&project-name=ab-testing-google-optimize&repository-name=ab-testing-google-optimize
demoUrl: https://edge-functions-ab-testing-google-optimize.vercel.app
relatedTemplates:
  - ab-testing-simple
  - ab-testing-statsig
---

# A/B Testing with Google Optimize

[Google Optimize](https://marketingplatform.google.com/about/optimize/) is Google' optimization tool and A/B testing solution, natively integrated with Google Analytics. In this example we'll do A/B testing with Optimize experiments at the edge.

By A/B testing directly on the server-side, you'll reduce layout shift from client-loaded experiments and improving your site's performance with smaller JavaScript bundles.

## Demo

https://edge-functions-ab-testing-google-optimize.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/ab-testing-google-optimize&project-name=ab-testing-google-optimize&repository-name=ab-testing-google-optimize)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/edge-middleware/ab-testing-google-optimize ab-testing-google-optimize
```

[`middleware.ts`](middleware.ts) loads the experiments using a pre-defined JSON file ([lib/optimize-experiments.json](lib/optimize-experiments.json)), it currently has to be edited manually in order to add the experiments created in https://optimize.google.com.

Run Next.js in development mode:

```bash
pnpm dev
```

Once the page loads (http://localhost:3000) the layout will load the `optimize.js` script using your google tracking id, and the pages will register events for the current experiment and variant.

To create your own experiments you'll need an account with [Google Optimize](https://optimize.google.com/optimize/home). Once that's done, copy the `.env.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.example .env.local
```

Then open `.env.local` and set the environment variables to match the ones for your Google Optimize account.

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
