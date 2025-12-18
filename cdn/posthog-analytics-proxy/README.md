---
name: PostHog analytics reverse proxy (vercel.ts)
slug: posthog-analytics-proxy
description: Proxy PostHog analytics requests through Vercel to bypass ad blockers using vercel.ts.
framework: Next.js
useCase: Analytics
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/cdn/posthog-analytics-proxy&project-name=posthog-analytics-proxy&repository-name=posthog-analytics-proxy&env=NEXT_PUBLIC_POSTHOG_KEY
demoUrl: https://posthog-analytics-proxy.vercel.app
---

# PostHog analytics reverse proxy (vercel.ts) example

This example shows how to proxy PostHog analytics requests through Vercel's routing layer to bypass ad blockers. By proxying requests through your own domain instead of sending them directly to PostHog, ad blockers that filter requests to analytics domains won't catch them.

## Demo

https://posthog-analytics-proxy.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/cdn/posthog-analytics-proxy&project-name=posthog-analytics-proxy&repository-name=posthog-analytics-proxy&env=NEXT_PUBLIC_POSTHOG_KEY)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

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

1. `vercel.ts` runs at deployment and configures two proxy routes:
   - `/ph/static/(.*)` → `https://us-assets.i.posthog.com/static/$1` (static assets)
   - `/ph/(.*)` → `https://us.i.posthog.com/$1` (API requests)
2. The `host` header is rewritten to the PostHog domain so their servers correctly route the requests.
3. Initialize PostHog with `api_host: '/ph'` to point all requests through your proxy.
4. Requests now appear to come from your domain, so domain-based ad blockers don't filter them out.

## Benefits

- **Bypass ad blockers**: Analytics requests aren't filtered by domain-based blockers
- **No configuration needed**: Just set your API key and deploy
- **Works everywhere**: Works with Next.js, Vue, Astro, or any framework
- **No edge function costs**: Uses Vercel's reverse proxy layer
- **Transparent**: PostHog receives the data normally, your app works as expected

## PostHog initialization

In your Next.js app, initialize PostHog with the proxy path:

```jsx
// app/layout.tsx or pages/_app.tsx
import PostHog from 'posthog-js'

if (typeof window !== 'undefined') {
  PostHog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: '/ph',
    ui_host: 'https://us.posthog.com',
  })
}
```

Now all analytics calls go through your `/ph` proxy endpoint instead of directly to PostHog's domain.

## Learn More

- [PostHog Reverse Proxy Documentation](https://posthog.com/docs/advanced/proxy)
- [Vercel Reverse Proxy Documentation](https://vercel.com/kb/guide/vercel-reverse-proxy-rewrites-external)
- [Vercel Config Documentation](https://vercel.com/docs/project-configuration)

