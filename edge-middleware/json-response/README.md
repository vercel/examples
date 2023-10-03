---
marketplace: false
---

# JSON Response Example

```ts
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  return new Response(JSON.stringify({ message: 'hello world!' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
```

## Demo

https://edge-functions-json-response.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/json-response&project-name=json-response&repository-name=json-response)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/edge-middleware/json-response json-response
```

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
