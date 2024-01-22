---
name: Edge Redirects with Bloom Filter
slug: edge-redirects-bloom-filter
description: Redirect a large list of redirects using a Bloom Filter and Edge Middleware.
framework: Next.js
useCase: Edge Middleware
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/redirects-bloom-filter&project-name=redirects-bloom-filter&repository-name=redirects-bloom-filter
demoUrl: https://redirects-bloom-filter.vercel.app/
relatedTemplates:
  - redirects-upstash
---

# Edge Middleware Redirects with Bloom Filter

This example shows how you can use a [Bloom Filter](https://en.wikipedia.org/wiki/Bloom_filter) in Edge Middleware to speed up the lookup of a large list of redirects. The demo has a total of 50,000 redirects, hard-coded in a JSON file.

Although a JSON file is being used, the principles are the same if storing the redirects in a database.

## Demo

https://redirects-bloom-filter.vercel.app/

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme):

[![Deploy with Vercel](https://vercel.com/button)](https://github.com/vercel/examples/tree/main/edge-middleware/redirects-bloom-filter&project-name=redirects-bloom-filter&repository-name=redirects-bloom-filter)

### Clone and Deploy

Use [`create-next-app`](https://nextjs.org/docs/app/api-reference/create-next-app) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/edge-middleware/redirects-bloom-filter
```

Next, run Next.js in development mode:

```bash
pnpm dev
# or
yarn dev
# or
npm run dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
