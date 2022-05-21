---
name: Microfrontends
slug: microfrontends
description: Microfrontends allow teams to work independently of each other by splitting the application into smaller, shareable, and modular components.
framework: Next.js
useCase: Documentation
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/microfrontends&project-name=microfrontends&repository-name=microfrontends
demoUrl: https://microfrontends.vercel.app
---

# Microfrontends

Microfrontends allow teams to work independently of each other by splitting the application into smaller, shareable, and modular components.

The main goal of microfrontends is to improve collaboration between teams and overall DX, and we should be able to do this without hurting performance (UX).

We recomming reading the [How it works](#how-it-works) section to understand the reasoning behind our implementation.

## Demo

https://microfrontends.vercel.app

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/microfrontends&project-name=microfrontends&repository-name=microfrontends)

## Getting Started

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/solutions/microfrontends microfrontends
# or
yarn create next-app --example https://github.com/vercel/examples/tree/main/solutions/microfrontends microfrontends
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

## How it works

### What is included

Everything is on TypeScript

#### Design System with Tailwind and CSS Modules

[./packages/design-system](./packages/design-system) features multiple components with CSS Modules and [Tailwind](https://tailwindcss.com/)

- Shared components with npm and next-transpile-modules (CSS Modules, tailwind)
- Shared pages with npm and next-transpile-modules (CSS Modules, tailwind)
- URL imports, ideally with CSS Modules support too
- bit.dev use case
- Monorepo support / has to work with polyrepos too
- Multi zones case in an ideal scenario to avoid hurting transitions (e.g only do /docs/\*)
- Multi tenants: component/page living in the website of a client (e.g embedded tweets), might be better on a different example

### What is not included

- Adding components or pages at runtime (not recommended)
- Testing setup (This is important, but won't be included in the example)
