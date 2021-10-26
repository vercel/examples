# CORS Example

Below is the code from [pages/\_middleware.ts](pages/_middleware.ts):

```ts
import type { NextFetchEvent, NextRequest } from 'next/server'
import cors from '../lib/cors'

export function middleware(ev: NextFetchEvent) {
  ev.respondWith(handler(ev.request))
}

async function handler(req: NextRequest) {
  // `cors` also takes care of handling OPTIONS requests
  return cors(
    req,
    new Response(JSON.stringify({ message: 'Hello World!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  )
}
```

Test it out with:

```bash
curl -i -X OPTIONS -H 'origin: https://vercel.com' https://edge-functions-cors.vercel.sh
```

## Demo

https://edge-functions-cors.vercel.sh

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/examples/tree/main/edge-functions/cors&project-name=cors&repository-name=cors)

### Clone and Deploy

Download this repository via git:

```bash
git clone https://github.com/vercel/examples.git
```

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example edge-middleware/examples/cors cors
# or
yarn create next-app --example edge-middleware/examples/cors cors
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
