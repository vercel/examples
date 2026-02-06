---
name: Custom Error Pages (App Router)
slug: custom-error-pages-app-dir
description: Create custom 5xx error pages using Next.js App Router
framework: Next.js
useCase: Edge Functions
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/cdn/custom-error-pages-app-dir&project-name=custom-error-pages-app-dir&repository-name=custom-error-pages-app-dir
demoUrl: https://custom-error-pages-app-dir.vercel.app
---

# Custom Error Pages (App Router)

This example demonstrates how to create custom error pages for 5xx server errors using Next.js App Router. This feature is available for Enterprise customers.

## Demo

https://custom-error-pages-app-dir.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/cdn/custom-error-pages-app-dir&project-name=custom-error-pages-app-dir&repository-name=custom-error-pages-app-dir)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/cdn/custom-error-pages-app-dir
```

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples) ([Documentation](https://nextjs.org/docs/deployment)).

## Structure

```
app/
├── 500/
│   └── page.tsx    # Generic server error (fallback for all 5xx)
└── 504/
    └── page.tsx    # Specific gateway timeout page
```

## How it works

When deployed to Vercel, error pages are automatically detected and routes are generated:

| Error | Destination |
|-------|-------------|
| 500 | `/500` (from `app/500/page.tsx`) |
| 502 | `/500` (fallback) |
| 503 | `/500` (fallback) |
| 504 | `/504` (from `app/504/page.tsx`) |
| 508 | `/500` (fallback) |

## Learn more

- [Custom Error Pages Documentation](https://vercel.com/docs/cdn/custom-error-pages)
