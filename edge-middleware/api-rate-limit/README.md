---
name: API Rate Limiting with Upstash
slug: api-rate-limit-upstash
description: Template featuring API Rate limiting at the edge with Redis using Upstash.
framework: Next.js
useCase: Edge Functions
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-functions/api-rate-limit&env=UPSTASH_REST_API_DOMAIN,UPSTASH_REST_API_TOKEN&project-name=api-rate-limit-upstash&repository-name=api-rate-limit-upstash
demoUrl: https://edge-functions-api-rate-limit.vercel.app
---

# API Rate Limiting with Upstash

This example features API Rate limiting at the edge with Redis using [Upstash](https://upstash.com/).

The pattern for rate limiting is inspired by the [GitHub API](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting).

## Demo

https://edge-functions-api-rate-limit.vercel.app

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-functions/api-rate-limit&env=UPSTASH_REST_API_DOMAIN,UPSTASH_REST_API_TOKEN&project-name=api-rate-limit-upstash&repository-name=api-rate-limit-upstash)

## Getting Started

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/edge-functions/api-rate-limit api-rate-limit
# or
yarn create next-app --example https://github.com/vercel/examples/tree/main/edge-functions/api-rate-limit api-rate-limit
```

You'll need to have an account with [Upstash](https://upstash.com/). Once that's done, copy the `.env.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.example .env.local
```

Then open `.env.local` and set the environment variables to match the REST API of your database. It should look like this:

```bash
UPSTASH_REST_API_DOMAIN = "us1-shiny-firefly-12345.upstash.io"
UPSTASH_REST_API_TOKEN = "your-api-token"
```

Next, run Next.js in development mode:

```bash
npm install
npm run dev

# or

yarn
yarn dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
