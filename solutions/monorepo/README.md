# Monorepo

This is a monorepo example with a single Next.js site ([./app](./app)) that has installed two local packages:

- [./packages/ui](./packages/ui): Exports UI components that use TypeScript and Tailwind CSS
- [./packages/utils](./packages/utils): Exports utilty functions that use TypeScript

The monorepo is using [Turborepo](https://turborepo.org/) and [npm workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces#using-workspaces) to link packages together, but it can also work with [yarn workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/).

> In addition to the local packages, it's also using a external package called [`@vercel/examples-ui`](../../packages/ui) that's inside this same repository, it uses `next-transpile-modules` to transpile its UI components that use CSS Modules. `next-transpile-modules` has an impact in build times, but that's okay for local packages, if you wish to publish you package you should compile it instead.

## Demo

https://solutions-monorepo.vercel.sh

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/examples/tree/main/solutions/monorepo&project-name=monorepo&repo-name=monorepo&root-directory=solutions%2Fmonorepo%2Fapp&build-command=cd%20..%20%26%26%20npm%20run%20build&install-command=cd%20..%20%26%26%20npm%20i)

## Getting Started

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/solutions/monorepo monorepo
# or
yarn create next-app --example https://github.com/vercel/examples/tree/main/solutions/monorepo monorepo
```

Next, run `app` in development mode:

```bash
yarn
yarn turbo run dev

# or

npm install
npx turbo run dev
```

The app should be up and running at http://localhost:3000.

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
