---
name: Run A/B Tests with GrowthBook
slug: ab-testing-growthbook
publisher: GrowthBook
description: An example app showcasing the many ways to integrate GrowthBook with your Next.js app.
framework:
  - Next.js
  - React
type: Edge Middleware
css: Tailwind
githubUrl: https://github.com/vercel/examples/tree/main/edge-middleware/ab-testing-growthbook
demoUrl: https://ab-testing-example-growthbook.vercel.app/
relatedTemplates:
  - ab-testing-google-optimize
  - ab-testing-simple
deployUrl: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fgrowthbook%2Fexamples%2Ftree%2Fmain%2Fnext-js&env=NEXT_PUBLIC_GROWTHBOOK_API_HOST,NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY&envDescription=Find%20your%20API%20Host%20and%20Client%20Key%20under%20your%20SDK%20Connections%20in%20GrowthBook&envLink=https%3A%2F%2Fapp.growthbook.io%2Fsdks
---

# ab-testing-growthbook example

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

# ab-testing-growthbook example

This example illustrates the different ways you can integrate GrowthBook with your Next.js app.

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fgrowthbook%2Fexamples%2Ftree%2Fmain%2Fnext-js&env=NEXT_PUBLIC_GROWTHBOOK_API_HOST,NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY&envDescription=Find%20your%20API%20Host%20and%20Client%20Key%20under%20your%20SDK%20Connections%20in%20GrowthBook&envLink=https%3A%2F%2Fapp.growthbook.io%2Fsdks)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/edge-middleware/ab-testing-growthbook
```

#### Set up environment variables

Log in to [GrowthBook](https://app.growthbook.io/) and navigate to **SDK Configuration -> SDK Connections**. Create an SDK connection for your app.
Then, copy [.env.example](./env.example) to `.env.local` and fill it in with your API Host and Client Key:

```bash
cp .env.example .env.local
```

(`NEXT_PUBLIC_GROWTHBOOK_DECRYPTION_KEY` is optional.)

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
