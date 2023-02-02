---
name: User-Agent Based Rendering
slug: edge-functions-user-agent-based-rendering
description: Learn how to render a different page based on the User-Agent header.
framework: Next.js
useCase: Edge Middleware
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/user-agent-based-rendering&project-name=user-agent-based-rendering&repository-name=user-agent-based-rendering
demoUrl: https://edge-user-agent-based-rendering.vercel.app
relatedTemplates:
  - ab-testing-simple
---

# User-Agent Based Rendering

This example shows how to render a different page based on the [User-Agent header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent).

## Demo

https://edge-user-agent-based-rendering.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/user-agent-based-rendering&project-name=user-agent-based-rendering&repository-name=user-agent-based-rendering)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/edge-middleware/user-agent-based-rendering
# or
yarn create next-app --example https://github.com/vercel/examples/tree/main/edge-middleware/user-agent-based-rendering
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
