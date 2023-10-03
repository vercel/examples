---
name: Hello World Edge
slug: edge-hello-world
description: A classic Hello World for the edge.
framework: None
useCase: Edge Functions
css: None
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-functions/hello-world&project-name=edge-hello-world&repository-name=edge-hello-world
demoUrl: https://edge-api-route.vercel.app/api/edge
relatedTemplates:
  - edge-hello-world-next
  - edge-json-response
  - edge-query-parameters
---

# Hello World Edge

A classic Hello World for the edge.

## Demo

https://edge-api-route.vercel.app/api/edge

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/examples/tree/main/edge-functions/hello-world&project-name=edge-hello-world&repository-name=edge-hello-world)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/edge-functions/hello-world edge-hello-world
# or
yarn create next-app --example https://github.com/vercel/examples/tree/main/edge-functions/hello-world edge-hello-world
```

Install the Vercel CLI:

```bash
npm i -g vercel
```

Then run the app at the root of the repository:

```bash
vercel dev
```
