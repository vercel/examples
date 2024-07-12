---
name: Hypertune Integration example
slug: feature-flag-hypertune
description: Learn to use Hypertune, a powerful feature flag, A/B testing, analytics and app configuration platform.
framework: Next.js
useCase: Edge Middleware
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fhypertunehq%2Fvercel-examples-fork%2Ftree%2Fmain%2Fedge-middleware%2Ffeature-flag-hypertune&env=NEXT_PUBLIC_HYPERTUNE_TOKEN,HYPERTUNE_ADMIN_TOKEN,EDGE_CONFIG,EDGE_CONFIG_HYPERTUNE_ITEM_KEY,FLAGS_SECRET&envDescription=Environment%20variables%20needed%20to%20use%20Hypertune%20with%20Vercel%20Edge%20Config%20and%20the%20Vercel%20Toolbar&envLink=https%3A%2F%2Fdocs.hypertune.com%2Fgetting-started%2Fvercel-quickstart&project-name=feature-flag-hypertune&repository-name=feature-flag-hypertune&demo-title=Hypertune%20with%20Vercel&demo-description=Use%20Hypertune%20with%20Vercel%20Edge%20Config%20and%20the%20Vercel%20Toolbar&demo-url=https%3A%2F%2Ffeature-flag-hypertune.vercel.app%2F&demo-image=https%3A%2F%2Ffeature-flag-hypertune.vercel.app%2Fdemo.png&integration-ids=oac_naLXREDG2o9KihTGYBVz9fVl
demoUrl: https://feature-flag-hypertune.vercel.app
relatedTemplates:
  - maintenance-page
  - feature-flag-apple-store
---

# Feature flags, A/B testing, analytics and app configuration with Hypertune and Vercel

[Hypertune](https://www.hypertune.com/) is a powerful feature flag, A/B testing, analytics and app configuration platform. Optimized for TypeScript, React and Next.js. Built with full end-to-end type-safety and Git-style version control.

No need to juggle different SDKs for the server and the client. Install one SDK that works across the server and the client and is compatible with the App Router and Server Components.

Avoid layout shift, UI flickers, hydration errors and page load delay. Instantly initialize the SDK on the server from Vercel Edge Config. And instantly initialize the SDK on the client from server props on the first render.

Static typing and code generation gives you full end-to-end type-safety across your flag inputs, outputs and logic so you can be confident in your code and upgrade your developer experience.

This example shows how to use the [Hypertune integration](https://vercel.com/integrations/hypertune) with Vercel Edge Config to initialize the Hypertune SDK with near-zero latency on the server so you can access your feature flags and run A/B tests with no performance impact to your app.

It also shows how to integrate Hypertune with Vercel's Flags SDK to use the Vercel Toolbar, to view and override your feature flags without leaving your frontend, and Vercel's Flags pattern.

## Deploy with Vercel

Deploy this example with Vercel in one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fhypertunehq%2Fvercel-examples-fork%2Ftree%2Fmain%2Fedge-middleware%2Ffeature-flag-hypertune&env=NEXT_PUBLIC_HYPERTUNE_TOKEN,HYPERTUNE_ADMIN_TOKEN,EDGE_CONFIG,EDGE_CONFIG_HYPERTUNE_ITEM_KEY,FLAGS_SECRET&envDescription=Environment%20variables%20needed%20to%20use%20Hypertune%20with%20Vercel%20Edge%20Config%20and%20the%20Vercel%20Toolbar&envLink=https%3A%2F%2Fdocs.hypertune.com%2Fgetting-started%2Fvercel-quickstart&project-name=feature-flag-hypertune&repository-name=feature-flag-hypertune&demo-title=Hypertune%20with%20Vercel&demo-description=Use%20Hypertune%20with%20Vercel%20Edge%20Config%20and%20the%20Vercel%20Toolbar&demo-url=https%3A%2F%2Ffeature-flag-hypertune.vercel.app%2F&demo-image=https%3A%2F%2Ffeature-flag-hypertune.vercel.app%2Fdemo.png&integration-ids=oac_naLXREDG2o9KihTGYBVz9fVl)

You'll be guided through installing the [Hypertune Vercel integration](https://vercel.com/integrations/hypertune) and setting up the required environment variables.

You will also need to provide a `FLAGS_SECRET` environment variable. You can generate one with `node -e "console.log(crypto.randomBytes(32).toString('base64url'))"`.

### Update your feature flag logic

Once you've deployed your project, open the [Hypertune UI](https://app.hypertune.com/) to update your feature flag logic.

### Develop your project locally

1. Clone your project's repository and `cd` into it
2. Run `vercel link` to link to the Vercel project
3. Run `vercel env pull .env.development.local` to pull your environment variables
4. Run `pnpm i`
5. Run `pnpm run dev`

### Add new feature flags

To add a new feature flag, create it in the [Hypertune UI](https://app.hypertune.com/), then regenerate the client with `pnpm hypertune` so you can access it with full end-to-end type-safety.
