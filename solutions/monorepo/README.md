# Monorepo

This is a monorepo example with a single Next.js site ([./app](./app)) that has installed two local packages that get transpiled with [`next-transpile-modules`](https://www.npmjs.com/package/next-transpile-modules):

- [./packages/ui](./packages/ui): Exports UI components that use TypeScript, CSS Modules and Tailwind CSS
- [./packages/utils](./packages/utils): Exports utilty functions that use TypeScript

By using `next-transpile-modules` in untranspiled packages Next.js will take care of building the package alongside your pages ([./app/next.config.js](./app/next.config.js)). We already do this for all examples in this repository where they share a common UI package ([@vercel/edge-functions-ui](../../packages/ui)).

The monorepo is using [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces#using-workspaces) to link packages together, but it can also work with [yarn workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/) and [Lerna](https://github.com/lerna/lerna).

## Demo

https://solutions-monorepo.vercel.sh

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/examples/tree/main/solutions/monorepo&project-name=monorepo&repository-name=monorepo)

## Getting Started

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/solutions/monorepo monorepo
# or
yarn create next-app --example https://github.com/vercel/examples/tree/main/solutions/monorepo monorepo
```

Next, run `app` in development mode:

```bash
npm install
npm run dev -w=app
```

The app should be up and running at http://localhost:3000.

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
