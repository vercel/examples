# Contentful CMS bulk redirects (vercel.ts) example

This example shows how to pull redirect entries from Contentful at build time, write them to a bulk redirects file, and publish them with the new `vercel.ts` config. The demo uses an e-commerce catalog so marketing can rotate seasonal URLs without shipping code.

## Demo

https://cms-bulk-redirects.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/cdn/cms-bulk-redirects&project-name=cms-bulk-redirects&repository-name=cms-bulk-redirects&env=CONTENTFUL_SPACE_ID,CONTENTFUL_ACCESS_TOKEN)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/cdn/cms-bulk-redirects
```

Next, run Next.js in development mode:

```bash
pnpm dev
```

## Environment variables

- `CONTENTFUL_SPACE_ID` – Contentful space ID
- `CONTENTFUL_ACCESS_TOKEN` – Content Delivery API token (CDA)

The example ships a small `generated-redirects.json` for local runs. When the environment variables are present, `vercel.ts` fetches real entries from Contentful and rewrites the bulk redirects file before build.

## How it works

1. `vercel.ts` runs at build time. It pulls `redirect` entries from Contentful, transforms them into Vercel bulk redirect objects, and writes `generated-redirects.json`.
2. The `config` exported from `vercel.ts` sets `bulkRedirectsPath` to that file. Vercel publishes the redirects without touching Next.js routing, middleware, or edge functions.
3. The UI shows an e-commerce catalog with collections that map to redirect targets like `/catalog/fall-2025` or `/catalog/limited-edition`. Legacy vanity paths such as `/catalog/fall` or `/products/daybreak-pack` are captured by bulk redirects.

You can extend this pattern to any CMS: swap the fetch logic, keep the same `bulkRedirectsPath`.
---
name: Contentful CMS bulk redirects (vercel.ts)
slug: cms-bulk-redirects
description: Sync redirect entries from Contentful into Vercel bulk redirects using vercel.ts.
framework: Next.js
useCase: Redirects
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/cdn/cms-bulk-redirects&project-name=cms-bulk-redirects&repository-name=cms-bulk-redirects&env=CONTENTFUL_SPACE_ID,CONTENTFUL_ACCESS_TOKEN
demoUrl: https://cms-bulk-redirects.vercel.app
---

# Contentful CMS bulk redirects (vercel.ts) example

This example shows how to pull redirect entries from Contentful at build time, write them to a bulk redirects file, and publish them with the new `vercel.ts` config. The demo uses an e-commerce catalog so marketing can rotate seasonal URLs without shipping code.
