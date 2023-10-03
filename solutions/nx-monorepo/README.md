---
name: Monorepo with Nx
slug: monorepo-nx
description: Learn to implement a monorepo with a single Next.js site using Nx.
framework: Next.js
useCase: Documentation
css: CSS
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/nx-monorepo&project-name=nx-monorepo&output-directory=dist%2Fapps%2Fapp%2F.next&build-command=npx%20nx%20build%20app%20--prod&ignore-command=npx%20nx-ignore%20app&repository-name=nx-monorepo
demoUrl: https://solutions-nx-monorepo.vercel.sh
relatedTemplates:
  - monorepo-turborepo
  - turborepo-next-basic
  - turborepo-sveltekit-starter
---

# Nx Monorepo

This is a monorepo example using [Nx](https://nx.dev) and a single Next.js site in [./apps/app](./apps/app).

## Demo

https://solutions-nx-monorepo.vercel.sh

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/examples/tree/main/solutions/nx-monorepo&project-name=nx-monorepo&output-directory=dist%2Fapps%2Fapp%2F.next&build-command=npx%20nx%20build%20app%20--prod&ignore-command=npx%20nx-ignore%20app&repository-name=nx-monorepo)

## Getting Started

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init), [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/), or [pnpm](https://pnpm.io) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/solutions/nx-monorepo nx-monorepo
```

```bash
yarn create next-app --example https://github.com/vercel/examples/tree/main/solutions/nx-monorepo nx-monorepo
```

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/solutions/nx-monorepo nx-monorepo
```

### Development server

Run `npx nx serve app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

### Build

Run `npx nx build app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `npx nx test app` to execute the unit tests via [Jest](https://jestjs.io).

Run `npx nx affected:test` to execute the unit tests affected by a change.

### Code scaffolding

Run `nx g @nrwl/react:component my-component --project=app` to generate a new component.

### Generate an application

Run `npx nx g @nrwl/react:app new-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

### Generate a library

Run `npx nx g @nrwl/react:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@with-nx/mylib`.

### Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.

## Nx Cloud

This example is configured to work out of the box with Nx Cloud. However, if deploying an existing project to Vercel - ensure:

If using `@nrwl/nx-cloud@14.6.0` or above

1. Set `NX_CACHE_DIRECTORY=/tmp/nx-cache`

If using `@nrwl/nx-cloud@14.5.0` or below

1. Set `NX_CACHE_DIRECTORY=/tmp/nx-cache`
2. Set the `cacheDirectory` option for the `@nrwl/nx-cloud` runner in your `nx.json` to match the value of the `NX_CACHE_DIRECTORY` environment variable:

```jsonc
"runner": "@nrwl/nx-cloud",
"options": {
  // this must be the same value as `NX_CACHE_DIRECTORY`
  "cacheDirectory": "/tmp/nx-cache"
}
```

Visit [Nx Cloud](https://nx.app/) to learn more.
