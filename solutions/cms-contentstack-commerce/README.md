---
name: ContentStack Commerce
slug: cms-contentstack-commerce
description: Learn to use ContentStack SDK to create apps with Next.js and Vercel.
framework: Next.js
useCase: Documentation
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/cms-contentstack-commerce&project-name=cms-contentstack-commerce&repository-name=cms-contentstack-commerce&env=CONTENTSTACK_API_KEY,CONTENTSTACK_ACCESS_TOKEN,CONTENTSTACK_ENV
demoUrl: https://solutions-cms-contentstack-commerce.vercel.app
---

# ContentStack Commerce Demo

This examples shows how to use ContentStack SDK to create apps with Next.js and Vercel

## Demo

https://solutions-cms-contentstack-commerce.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/cms-contentstack-commerce&project-name=cms-contentstack-commerce&repository-name=cms-contentstack-commerce&env=CONTENTSTACK_API_KEY,CONTENTSTACK_ACCESS_TOKEN,CONTENTSTACK_ENV)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/solutions/cms-contentstack-commerce cms-contentstack-commerce
```

Copy the `.env.example` file in this directory to `.env.local` and set your Contentstack settings

```bash
cp .env.example .env.local
```

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
