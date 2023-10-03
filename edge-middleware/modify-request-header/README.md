---
name: Modifying Request Headers in Middleware
slug: edge-functions-modify-request-header
description: Learn to add/update/delete request headers in a middleware.
framework: Next.js
useCase:
  - Edge Middleware
  - Documentation
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/modify-request-header&project-name=modify-request-header&repository-name=modify-request-header
demoUrl: https://edge-middleware-modify-request-header.vercel.app
relatedTemplates:
  - edge-functions-add-header
---

# Add Header Example

Below is the code from [middleware.ts](middleware.ts) showing how to add/update/delete headers in a middleware (available since Next.js v13.0.0):

```ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Clone the request headers
  // You can modify them with headers API: https://developer.mozilla.org/en-US/docs/Web/API/Headers
  const requestHeaders = new Headers(request.headers)

  // Add new request headers
  requestHeaders.set('x-hello-from-middleware1', 'hello')
  requestHeaders.set('x-hello-from-middleware2', 'world!')

  // Update an existing request header
  requestHeaders.set('user-agent', 'New User Agent overriden by middleware!')

  // Delete an existing request header
  requestHeaders.delete('x-from-client')

  // You can also set request headers in NextResponse.rewrite
  return NextResponse.next({
    request: {
      // New request headers
      headers: requestHeaders,
    },
  })
}
```

## Demo

https://edge-middleware-modify-request-header.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/modify-request-header&project-name=modify-request-header&repository-name=modify-request-header)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/edge-middleware/modify-request-header modify-request-header
```

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
