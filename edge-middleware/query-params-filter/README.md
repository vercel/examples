---
name: Filtering Query Parameters
slug: edge-functions-filter-query-params
description: Learn how to filter query params in Edge Middleware.
framework: Next.js
useCase:
  - Edge Middleware
  - Documentation
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/query-params-filter&project-name=query-params-filter&repository-name=query-params-filter
demoUrl: https://edge-functions-query-params-filter.vercel.app
relatedTemplates:
  - ab-testing-simple
---

# Filtering Query Parameters

The example shows how to filter query parameters from the URL using Edge Middleware.

To see how it works, check the middleware function in [`middleware.ts`](middleware.ts):

```ts
import { NextRequest, NextResponse } from 'next/server'

const allowedParams = ['allowed']

export const config = {
  matcher: '/',
}

export default function middleware(req: NextRequest) {
  const url = req.nextUrl
  let changed = false

  url.searchParams.forEach((_, key) => {
    if (!allowedParams.includes(key)) {
      url.searchParams.delete(key)
      changed = true
    }
  })

  // Avoid infinite loop by only redirecting if the query
  // params were changed
  if (changed) {
    return NextResponse.redirect(url)
    // It's also useful to do a rewrite instead of a redirect
    // return NextResponse.rewrite(url)
  }
}
```

## Demo

https://edge-functions-query-params-filter.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/query-params-filter&project-name=query-params-filter&repository-name=query-params-filter)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/edge-middleware/query-params-filter query-params-filter
```

Next, run Next.js in development mode:

```bash
pnpm dev
```

**Before URL:** http://localhost:3000?a=b&allowed=test

**After URL:** http://localhost:3000?allowed=test

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
