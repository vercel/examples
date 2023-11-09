---
name: Monorepo with Turborepo
slug: monorepo-turborepo
description: Learn to implement a monorepo with a single Next.js site that has installed two local packages.
framework: Next.js
useCase:
  - Monorepos
  - Documentation
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fsolutions%2Fmonorepo&project-name=monorepo&repository-name=monorepo&root-directory=apps%2Fapp
demoUrl: https://solutions-monorepo.vercel.sh
relatedTemplates:
  - monorepo-nx
  - turborepo-next-basic
  - turborepo-sveltekit-starter
---

# Monorepo

This is a monorepo example with a single Next.js site ([./apps/app](./apps/app)) that has installed two local packages:

- [./packages/ui](./packages/ui): Exports UI components that use TypeScript and Tailwind CSS and is compiled by SWC.
- [./packages/utils](./packages/utils): Exports utility functions that use TypeScript.

The monorepo is using [Turborepo](https://turborepo.org/) and [pnpm workspaces](https://pnpm.io/workspaces) to link packages together.

For more examples on monorepos check out the [official Turborepo examples](https://github.com/vercel/turborepo/tree/main/examples).

## Demo

https://solutions-monorepo.vercel.sh

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/monorepo&project-name=monorepo&repository-name=monorepo&root-directory=apps/app&install-command=pnpm%20install&build-command=cd%20..%2F..%20%26%26%20pnpm%20build%20--filter%3Dapp...&ignore-command=npx%20turbo-ignore)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/solutions/monorepo monorepo
```

Next, run `app` in development mode:

```bash
pnpm dev
```

The app should be up and running at http://localhost:3000.

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=monorepo-example) ([Documentation](https://nextjs.org/docs/deployment)).
