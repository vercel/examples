---
name: PostHog analytics reverse proxy (vercel.ts)
slug: posthog-analytics-proxy
description: Proxy PostHog analytics through your domain as first-party traffic using vercel.ts.
framework: Next.js
useCase: Analytics
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/cdn/posthog-analytics-proxy&project-name=posthog-analytics-proxy&repository-name=posthog-analytics-proxy&env=NEXT_PUBLIC_POSTHOG_KEY
demoUrl: https://posthog-analytics-proxy.vercel.app
---

# PostHog analytics reverse proxy (vercel.ts) example

This example shows how to proxy PostHog analytics requests through Vercel's routing layer as first-party traffic. The demo is a developer tool landing page with analytics tracking integrated throughout.

## Demo

https://posthog-analytics-proxy.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/cdn/posthog-analytics-proxy&project-name=posthog-analytics-proxy&repository-name=posthog-analytics-proxy&env=NEXT_PUBLIC_POSTHOG_KEY)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/cdn/posthog-analytics-proxy
```

Next, run Next.js in development mode:

```bash
pnpm dev
```

## Environment variables

- `NEXT_PUBLIC_POSTHOG_KEY` – Your PostHog project API key

## How it works

1. `vercel.ts` configures two proxy routes:
   - `/ph/static/(.*)` → `https://us-assets.i.posthog.com/static/$1` (static assets)
   - `/ph/(.*)` → `https://us.i.posthog.com/$1` (API requests)
2. The `host` header is rewritten so PostHog servers correctly route the proxied requests.
3. PostHog is initialized with `api_host: '/ph'` to send all requests through your proxy.
4. Analytics requests now go through your domain as first-party traffic.

You can extend this pattern to any analytics provider by configuring the appropriate rewrite rules.
