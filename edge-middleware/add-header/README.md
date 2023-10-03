---
name: Adding Response Headers in Edge Middleware
slug: edge-functions-add-header
description: Learn to add response headers at the edge.
framework: Next.js
useCase:
  - Edge Middleware
  - Documentation
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/add-header&project-name=add-header&repository-name=add-header
demoUrl: https://edge-functions-add-header.vercel.app
relatedTemplates:
  - nextjs-boilerplate
---

# Add Header Example

Below is the code from [middleware.ts](middleware.ts) showing how to add response headers at the edge:

```ts
import { NextResponse } from 'next/server'

export function middleware() {
  // Store the response so we can modify its headers
  const response = NextResponse.next()

  // Set custom header
  response.headers.set('x-modified-edge', 'true')

  // Return response
  return response
}
```

## Demo

https://edge-functions-add-header.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/add-header&project-name=add-header&repository-name=add-header)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/edge-middleware/add-header add-header
```

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
