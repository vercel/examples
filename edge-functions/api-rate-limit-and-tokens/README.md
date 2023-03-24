---
name: API Rate Limiting by IP and API Keys with Upstash
slug: api-rate-limit-and-tokens
description: Template featuring API Rate limiting by IP and API Keys at the edge using Upstash.
framework: Next.js
useCase: Edge Functions
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fedge-functions%2Fapi-rate-limit-and-tokens&env=UPSTASH_REST_API_DOMAIN,UPSTASH_REST_API_TOKEN,API_KEYS_JWT_SECRET_KEY&project-name=api-rate-limit-and-tokens&repository-name=api-rate-limit-and-tokens
demoUrl: https://edge-functions-api-rate-limit-and-tokens.vercel.app
relatedTemplates:
  - api-rate-limit-upstash
---

# API Rate Limiting by IP and API Keys with Upstash

This example features API Rate limiting by IP and API Keys at the edge with Redis using [Upstash](https://upstash.com/).

The pattern for rate limiting is inspired by the [GitHub API](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting).

## Demo

https://edge-functions-api-rate-limit-and-tokens.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fedge-functions%2Fapi-rate-limit-and-tokens&env=UPSTASH_REST_API_DOMAIN,UPSTASH_REST_API_TOKEN,API_KEYS_JWT_SECRET_KEY&project-name=api-rate-limit-and-tokens&repository-name=api-rate-limit-and-tokens)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/edge-functions/api-rate-limit-and-tokens api-rate-limit-and-tokens
```

You'll need to have an account with [Upstash](https://upstash.com/). Once that's done, copy the `.env.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.example .env.local
```

Then open `.env.local` and set the environment variables to match the REST API of your database. It should look like this:

```bash
UPSTASH_REST_API_DOMAIN = "us1-shiny-firefly-12345.upstash.io"
UPSTASH_REST_API_TOKEN = "your-api-token"
API_KEYS_JWT_SECRET_KEY = "a-secret-key"
```

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
