---
name: A/B Testing GrowthBook
slug: ab-testing-growthbook
description: By A/B testing at the edge, you'll reduce CLS from client-loaded experiments and improve your site's performance with smaller JS bundles.
framework: Next.js
useCase:
  - Edge Functions
  - Documentation
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-functions/ab-testing-growthbook&project-name=ab-testing-growthbook&repository-name=ab-testing-growthbook
demoUrl: https://edge-functions-ab-testing-growthbook.vercel.app
---

# A/B Testing GrowthBook

By A/B testing at the edge, you'll reduce layout shift from client-loaded experiments and improve your site's performance with smaller JavaScript bundles.

## Demo

https://edge-functions-ab-testing-growthbook.vercel.app

Since the different variants are generated statically at the edge, it mitigates any potential layout shift that could happen when a variant is inserted into the DOM client side, hence improving your site's performance.

Take a look at [`middleware.ts`](middleware.ts) to see how it works.

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-functions/ab-testing-growthbook&project-name=ab-testing-growthbook&repository-name=ab-testing-growthbook)

## Getting Started

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/edge-functions/ab-testing-growthbook ab-testing-growthbook
# or
yarn create next-app --example https://github.com/vercel/examples/tree/main/edge-functions/ab-testing-growthbook ab-testing-growthbook
```

You'll need to have an account with [GrowthBook](https://www.growthbook.io/). You can either [self-host](https://github.com/growthbook/growthbook) or create a [Cloud account](https://app.growthbook.io/). After logging in, click on the step, "Install our SDK", and take a look at the url which is listed as the API Endpoint in the instructions.

Once that's done, copy the `.env.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.example .env.local
```

Then open `.env.local` and set the environment variables to match the API Endpoint in the SDK instructions. This should be a url specific to your GrowthBook account. After that, go to the "Add your first feature" step in GrowthBook, and call this new feature "new-homepage" (this should be the feature key). Make sure that the feature type is set to "on/off" and choose "A/B Experiment" as the behavior. You can leave everything else as it is, which is to the default values in the feature modal.

Next, run Next.js in development mode:

```bash
npm install
npm run dev

# or

yarn
yarn dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
