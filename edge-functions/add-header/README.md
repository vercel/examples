# Add Header Example

Below is the code from [pages/\_middleware.ts](pages/_middleware.ts) with multiple examples of adding headers at the edge:

```ts
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  // You can add and append headers in multiple ways,
  // below we'll explore some common patterns

  // 1. Add a header to the `Headers` interface
  // https://developer.mozilla.org/en-US/docs/Web/API/Headers
  const headers = new Headers({ 'x-custom-1': 'value-1' })
  headers.set('x-custom-2', 'value-2')

  // 2. Add existing headers to a new `Response`
  const res = new Response(null, { headers })

  // 3. Add a header to an existing response
  res.headers.set('x-custom-3', 'value-3')

  // 4. Merge existing headers with new ones in a response
  return new Response(
    'Open the network tab in devtools to see the response headers',
    {
      headers: {
        ...Object.fromEntries(res.headers),
        'x-custom-4': 'value-4',
      },
    }
  )
}
```

## Demo

https://edge-functions-add-header.vercel.sh

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/examples/tree/main/edge-functions/add-header&project-name=add-header&repository-name=add-header)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/edge-functions/add-header add-header
# or
yarn create next-app --example https://github.com/vercel/examples/tree/main/edge-functions/add-header add-header
```

Next, run Next.js in development mode:

```bash
npm install
npm run dev

# or

yarn
yarn dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
