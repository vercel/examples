---
name: Edge Redirects with Upstash
slug: edge-redirects-upstash
description: Redirect from a list of redirects both hardcoded and coming from Upstash (Redis), that get evaluated at the edge.
framework: Next.js
useCase: Edge Middleware
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/redirects-upstash&env=KV_REST_API_URL,KV_REST_API_TOKEN,KV_REST_API_READ_ONLY_TOKEN&project-name=redirects-upstash&repository-name=redirects-upstash
demoUrl: https://edge-functions-redirects-upstash.vercel.app
relatedTemplates:
  - edge-functions-i18n
---

# Edge Redirects with Upstash

This demo features a list of redirects, both hardcoded and coming from Redis ([Upstash](https://upstash.com/)), that get evaluated at the edge.

The demo has a total of 10,000 redirects, 1,000 of which are hardcoded on a JSON file, and 9,000 added to Redis.

Redirects in a JSON file are faster to evaluate, but they can only be edited at build time, with Redis we can have editable redirects with a low latency cost.

## Demo

https://edge-functions-redirects-upstash.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/redirects-upstash&env=KV_REST_API_URL,KV_REST_API_TOKEN,KV_REST_API_READ_ONLY_TOKEN&project-name=redirects-upstash&repository-name=redirects-upstash)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/edge-middleware/redirects-upstash redirects-upstash
```

You'll need to have an account with [Upstash](https://upstash.com/). Once that's done, copy the `.env.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.example .env.local
```

Then open `.env.local` and set the REST API environment variables for your database. It should look like this:

```bash
# Upstash KV REST API
KV_REST_API_URL = "https://us1-shiny-firefly-12345.upstash.io"
KV_REST_API_TOKEN = "your-api-token"
KV_REST_API_READ_ONLY_TOKEN = "your-read-only-api-token"
POPULATE_REDIS = false
```

The build always creates 1,000 redirects in a local JSON file. To seed redirects 1,001 through 10,000 in Upstash, set `POPULATE_REDIS` to `true` for one build, then set it back to `false`. Seeding uses `KV_REST_API_TOKEN`; runtime lookups use `KV_REST_API_READ_ONLY_TOKEN`.

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
