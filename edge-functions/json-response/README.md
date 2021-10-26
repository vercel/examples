# JSON Response Example

```ts
import type { NextFetchEvent } from 'next/server'

export function middleware(ev: NextFetchEvent) {
  ev.respondWith(
    new Response(JSON.stringify({ message: 'hello world!' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  )
}
```

## Demo

https://edge-functions-json-response.vercel.sh

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/examples/tree/main/edge-functions/json-response&project-name=json-response&repository-name=json-response)

### Clone and Deploy

Download this repository via git:

```bash
git clone https://github.com/vercel/examples.git
```

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example edge-middleware/examples/json-response json-response
# or
yarn create next-app --example edge-middleware/examples/json-response json-response
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
