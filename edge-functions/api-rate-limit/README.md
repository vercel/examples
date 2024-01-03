---
name: API Rate Limiting with Vercel KV and Upstash
slug: api-rate-limit-upstash
description: Rate limit your Next.js application with Vercel KV and Upstash.
framework: Next.js
useCase: Edge Functions
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-functions/api-rate-limit?project-name=api-rate-limit&repository-name=api-rate-limit&stores=%5B%7B"type"%3A"kv"%7D%5D
demoUrl: https://edge-functions-api-rate-limit.vercel.app
relatedTemplates:
  - api-rate-limit-and-tokens
  - vercel-middleware-kv-redis
---

# API Rate Limiting with Vercel KV and Upstash

This example features API Rate limiting at the edge with [Vercel KV](https://vercel.com/docs/storage/vercel-kv).

## Demo

https://edge-functions-api-rate-limit.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-functions/api-rate-limit?project-name=api-rate-limit&repository-name=api-rate-limit&stores=%5B%7B"type"%3A"kv"%7D%5D)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/edge-functions/api-rate-limit api-rate-limit
```

Next, create a [Vercel KV](https://vercel.com/docs/storage/vercel-kv) database on your account and connect it to your project.

Copy the example `.env.local` file shown in the dashboard with the credentials needed to connect to your Redis database. It should look similar to this:

```bash
KV_URL="redis://..."
KV_REST_API_URL="https://..."
KV_REST_API_TOKEN="AXx3ASQ..."
KV_REST_API_READ_ONLY_TOKEN="Anx3ASQ..."
```

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
