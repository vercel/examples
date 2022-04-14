---
name: A/B Testing Simple
slug: ab-testing-simple
description: By A/B testing at the edge, you'll reduce CLS from client-loaded experiments and improve your site's performance with smaller JS bundles.
framework: Next.js
useCase:
  - Edge Functions
  - Documentation
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-functions/ab-testing-simple&project-name=ab-testing-simple&repository-name=ab-testing-simple
demoUrl: https://edge-functions-ab-testing-simple.vercel.app
---

# A/B Testing Simple

By A/B testing at the edge, you'll reduce layout shift from client-loaded experiments and improve your site's performance with smaller JavaScript bundles.

## Demo

https://edge-functions-ab-testing-simple.vercel.app

Since the different variants are generated statically at the edge, it mitigates any potential layout shift that could happen when a variant is inserted into the DOM client side, hence improving your site's performance.

Take a look at [`pages/home/_middleware.ts`](pages/home/_middleware.ts) to see how it works:

```javascript
import { NextRequest, NextResponse } from 'next/server'
import { getBucket } from '@lib/ab-testing'
import { HOME_BUCKETS } from '@lib/buckets'

const COOKIE_NAME = 'bucket-home'

export function middleware(req: NextRequest) {
  // Get the bucket cookie
  const bucket = req.cookies[COOKIE_NAME] || getBucket(HOME_BUCKETS)
  const url = req.nextUrl.clone()
  url.pathname = `/home/${bucket}`
  const res = NextResponse.rewrite(url)

  // Add the bucket to cookies if it's not there
  if (!req.cookies[COOKIE_NAME]) {
    res.cookie(COOKIE_NAME, bucket)
  }

  return res
}
```

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-functions/ab-testing-simple&project-name=ab-testing-simple&repository-name=ab-testing-simple)

## Getting Started

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/edge-functions/ab-testing-simple ab-testing-simple
# or
yarn create next-app --example https://github.com/vercel/examples/tree/main/edge-functions/ab-testing-simple ab-testing-simple
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
