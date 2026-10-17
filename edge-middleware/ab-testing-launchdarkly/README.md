---
name: A/B Testing with LaunchDarkly
slug: ab-testing-launchdarkly
description: Reduce CLS and improve performance from client-loaded experiments at the edge with LaunchDarkly
framework: Next.js
useCase:
  - Edge Config
  - Edge Middleware
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fedge-middleware%2Fab-testing-launchdarkly&project-name=ab-testing-launchdarkly&repository-name=ab-testing-launchdarkly&integration-ids=oac_8DFUMlauSkqeQhdGHpL5xbWp&env=NEXT_PUBLIC_LD_CLIENT_SIDE_ID,EDGE_CONFIG&envDescription=LaunchDarkly%20client-side%20ID%20and%20Edge%20Config%20connection%20string&envLink=https%3A%2F%2Fdocs.launchdarkly.com%2Fhome%2Fgetting-started
demoUrl: https://ab-testing-launchdarkly.vercel.app
relatedTemplates:
  - ab-testing-simple
  - ab-testing-statsig
  - feature-flag-launchdarkly
---

# A/B Testing with LaunchDarkly

This example shows how to do A/B testing at the edge using [LaunchDarkly](https://launchdarkly.com) and [Edge Config](https://vercel.com/docs/storage/edge-config). Experiment variants are assigned in Edge Middleware, so there is no client-side flicker and no extra round trip.

## Demo

https://ab-testing-launchdarkly.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

**Note:** Before clicking `Deploy`, complete the [Set up LaunchDarkly](#set-up-launchdarkly) section below to create a flag and obtain your client-side SDK key.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fedge-middleware%2Fab-testing-launchdarkly&project-name=ab-testing-launchdarkly&repository-name=ab-testing-launchdarkly&integration-ids=oac_8DFUMlauSkqeQhdGHpL5xbWp&env=NEXT_PUBLIC_LD_CLIENT_SIDE_ID,EDGE_CONFIG&envDescription=LaunchDarkly%20client-side%20ID%20and%20Edge%20Config%20connection%20string&envLink=https%3A%2F%2Fdocs.launchdarkly.com%2Fhome%2Fgetting-started)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/edge-middleware/ab-testing-launchdarkly ab-testing-launchdarkly
```

#### Set up environment variables

Copy [.env.example](./.env.example) to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in the variables as described in the next section.

#### Set up LaunchDarkly

1. Create a free account at [launchdarkly.com](https://launchdarkly.com).
2. In the LaunchDarkly dashboard, go to **Feature flags** and click **Create flag**.
3. Set the flag key to `ab-testing-example`.
4. Choose **String** as the flag type and add two variations:
   - `control` (default off variation)
   - `experiment` (default on variation)
5. Set up a targeting rule that splits traffic 50/50 between `control` and `experiment`.
6. Turn the flag on for your environment.
7. Go to **Account settings > Projects**, select your project, and copy the **Client-side ID** for your environment.
8. Add it to `.env.local` as `NEXT_PUBLIC_LD_CLIENT_SIDE_ID`.

#### Set up the LaunchDarkly Vercel Integration

Install the [LaunchDarkly Vercel Integration](https://vercel.com/integrations/launchdarkly) for your project. The integration syncs LaunchDarkly flag rules into Edge Config so they can be read at the edge without a network call to LaunchDarkly.

Once installed, set the `EDGE_CONFIG` environment variable in `.env.local` with the Edge Config connection string provided by the integration.

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).

## How it works

On each request to `/`, the middleware:

1. Reads (or generates) a user ID from a cookie.
2. Initializes the LaunchDarkly SDK using flag rules cached in Edge Config.
3. Calls `variation()` to get the assigned bucket (`control` or `experiment`).
4. Rewrites the request to `/{bucket}`.

Because the flag rules are read from Edge Config rather than fetched from LaunchDarkly on every request, the evaluation adds minimal latency. The user ID cookie ensures the same user always sees the same variant.
