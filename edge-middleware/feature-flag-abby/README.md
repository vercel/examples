---
name: A/B Testing with A/BBY
slug: ab-testing-abby
description: A/BBY is a service for developer focused Feature Flags & A/B Testing. In this template you'll be able to use feature flags and A/B tests at the edge.
framework: Next.js
useCase: Edge Middleware
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/ab-testing-abby&env=NEXT_PUBLIC_ABBY_PROJECT_ID&project-name=abby-demo&repository-name=ab-testing-abby
demoUrl: https://abby-nextjs-example.vercel.app/
relatedTemplates:
  - ab-testing-simple
---

# A/B Testing with ConfigCat

[A/BBY](https://tryabby.dev) is a service for developer focused Feature Flags & A/B Testing. In this Demo you'll be able to use feature flags and A/B tests at the edge.

By A/B testing directly on the server-side, you'll reduce layout shift from client-loaded experiments and improving your site's performance with smaller JavaScript bundles.

## Demo

https://abby-nextjs-example.vercel.app/

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/ab-testing-abby&env=NEXT_PUBLIC_ABBY_PROJECT_ID&project-name=abby-demo&repository-name=ab-testing-abby)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/edge-middleware/ab-testing-abby ab-testing-abby
```

You'll need to have a free [A/BBY](https://tryabby.dev/login) account. Once that's done, copy the `.env.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.example .env.local
```

Then open `.env.local` and set the `NEXT_PUBLIC_ABBY_PROJECT_ID` environment variable to your project's id. Your can copy your project's ID by clicking the Code button on the top right of your dashboard and selecting _Copy Project ID_.

The demo uses needs the following to be set in your A/BBY project:

- 1 Environment called _default_
- 2 Feature Flags (_serverFlag_ and _clientFlag_)
- 2 A/B Tests (_Home_ and _Marketing_)

Next, run Next.js in development mode:

```bash
pnpm dev
```

The `middleware.ts` file is used for the `/marketing` and `home/` routes. The user will see the page for his variant.

The index page ([pages/index.tsx](pages/index.tsx)) also shows how to do AB testing under the same path, in SSR and client-side.

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
