---
name: C1 by Thesys Generative UI Starter
slug: c1-thesys-genui-start
description: Starter template for generative UI with C1 by Thesys
framework: Next.js
useCase: Starter
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/starter/c1-thesys-dev&project-name=c1-thesys-dev&repository-name=c1-thesys-dev
demoUrl: https://c1-thesys-starter.vercel.app/
---

# C1 by Thesys App Example

Starter template for a generative UI app, powered by [C1 by Thesys](https://thesys.dev)

[![Built with Thesys](https://thesys.dev/built-with-thesys-badge.svg)](https://thesys.dev)

## Demo

https://c1-thesys-starter.vercel.app/

## Getting Started

First, generate a new API key from [Thesys Console](https://console.thesys.dev/keys) and then set it your environment variable.

```bash
export THESYS_API_KEY=<your-api-key>
```

Install dependencies:

```bash
pnpm i
```

Then, run the development server:

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing your responses by modifying the system prompt in `app/api/chat/route.ts`.

## Learn More

To learn more about Thesys C1, take a look at the [C1 Documentation](https://docs.thesys.dev) - learn about Thesys C1.

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/starter/c1-thesys-dev&project-name=c1-thesys-dev&repository-name=c1-thesys-dev)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/starter/c1-thesys-dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
