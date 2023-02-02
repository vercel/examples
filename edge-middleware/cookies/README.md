---
name: Adding Cookies
slug: cookies
description: Read and write cookies directly at the edge.
framework: Next.js
useCase:
  - Edge Middleware
  - Documentation
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/cookies&project-name=cookies&repository-name=cookies
demoUrl: https://edge-functions-cookies.vercel.app
relatedTemplates:
  - ab-testing-simple
---

# Cookies Example

You can read and write cookies directly on the edge and action as needed.

## Demo

https://edge-functions-cookies.vercel.app

Since you can read cookies on the edge and rewrite the user to a statically generated page, eliminates the need of using getServerSideProps + redirect just to access the cookie, hence improving your site's performance and maintaining the same url.

The magic happens in the [`middleware.ts` file](middleware.ts):

```javascript
import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: '/',
}

export function middleware(req: NextRequest) {
  // Parse the cookie
  const isInBeta = JSON.parse(req.cookies.get('beta')?.value || 'false')

  // Update url pathname
  req.nextUrl.pathname = `/${isInBeta ? 'beta' : 'non-beta'}`

  // Rewrite to url
  return NextResponse.rewrite(req.nextUrl)
}
```

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/cookies&project-name=cookies&repository-name=cookies)

## Getting Started

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/edge-middleware/cookies cookies
# or
yarn create next-app --example https://github.com/vercel/examples/tree/main/edge-middleware/cookies cookies
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
