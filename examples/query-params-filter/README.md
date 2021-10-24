# Filtering Query Parameters

```ts
import { NextRequest, NextResponse } from 'next/server'

const allowedParams = ['allowed']

export function middleware(req: NextRequest) {
  const url = req.nextUrl

  url.searchParams.forEach((_, key) => {
    if (!allowedParams.includes(key)) {
      url.searchParams.delete(key)
    }
  })

  return NextResponse.rewrite(url)
}
```

**Before URL:** http://localhost:3000?a=b&allowed=test
**After URL:** http://localhost:3000?allowed=test

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel-customer-feedback/edge-functions/tree/main/examples/query-params-filter&project-name=query-params-filter&repository-name=query-params-filter)

### Clone and Deploy

Download this repository via git:

```bash
git clone https://github.com/vercel-customer-feedback/edge-functions.git
```

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example edge-middleware/examples/query-params-filter query-params-filter
# or
yarn create next-app --example edge-middleware/examples/query-params-filter query-params-filter
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
