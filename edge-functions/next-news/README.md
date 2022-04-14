---
name: Next News
slug: next-news
description: Hacker news clone in Next.js.
framework: Next.js
useCase: Starter
css: CSS-in-JSX
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-functions/next-news&project-name=next-news&repository-name=next-news
demoUrl: https://next-news.vercel.app
---

# Next News

This is an example showing a hacker news clone using Next.js. Edge functions are used to show how a rewrite from `/` to `/news/1` works. Below is the code from [pages/\_middleware.ts](pages/_middleware.ts):

```ts
import { NextResponse, NextRequest } from 'next/server'

export default function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  if (url.pathname === '/') {
    url.pathname = '/news/1'
    return NextResponse.rewrite(url)
  }
}
```

## Demo

https://next-news.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-functions/next-news&project-name=next-news&repository-name=next-news)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/edge-functions/next-news next-news
# or
yarn create next-app --example https://github.com/vercel/examples/tree/main/edge-functions/next-news next-news
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
