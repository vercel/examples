---
name: IP Blocking with Upstash
slug: ip-blocking
description: Template featuring IP Blocking at the edge using Upstash.
framework: Next.js
useCase: Edge Middleware
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fedge-middleware%2Fapi-rate-limit-and-tokens&env=UPSTASH_REST_API_DOMAIN,UPSTASH_REST_API_TOKEN&project-name=ip-blocking&repository-name=ip-blocking
demoUrl: https://edge-functions-ip-blocking.vercel.app
relatedTemplates:
  - bot-protection-botd
  - bot-protection-datadome
  - ip-blocking-datadome
---

# IP Blocking with Upstash

This example features IP blocking at the edge with Redis using [Upstash](https://upstash.com/).

## Demo

https://edge-functions-ip-blocking.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fedge-middleware%2Fapi-rate-limit-and-tokens&env=UPSTASH_REST_API_DOMAIN,UPSTASH_REST_API_TOKEN&project-name=ip-blocking&repository-name=ip-blocking)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/edge-middleware/ip-blocking ip-blocking
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
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
