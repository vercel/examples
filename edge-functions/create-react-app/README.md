---
name: React with Vercel Edge Middleware
slug: react-vercel-edge-middleware
description: Customize redirects, rewrites, headers, and more.
framework: Create React App
useCase:
  - Edge Functions
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-functions/create-react-app&project-name=create-react-app&repository-name=create-react-app
demoUrl: https://cra-middleware.vercel.app
---

# Create React App with Edge Middleware

Below is the code from `pages/api/hello.ts`:

```ts
import { next } from '@vercel/edge'

export default function middleware(req) {
  return next({ headers: { 'x-cra-example': 'Hello!' } })
}
```

## Demo

https://cra-middleware.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/examples/tree/main/edge-functions/create-react-app&project-name=create-react-app&repository-name=create-react-app)

### Clone and Deploy

Download this repository via git:

```bash
git clone https://github.com/vercel/examples.git
```

Next, run the application locally with `vercel dev`:

```bash
npm i -g vercel
vercel dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
