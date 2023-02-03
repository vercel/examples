---
name: Authentication Proxy
slug: edge-authentication-proxy
description: An auth proxy on the edge.
framework: None
useCase: Edge Functions
css: None
deployUrl: https://vercel.com/new/git/external?repository-url=https://github.com/vercel/examples/tree/main/edge-functions/authed-proxy&project-name=edge-authentication-proxy&repository-name=edge-authentication-proxy
demoUrl: https://authed-proxy.vercel.app/api/proxy
relatedTemplates:
  - edge-hello-world
  - basic-auth-password
---

# Authentication Proxy

An auth proxy on the edge.

## Demo

https://authed-proxy.vercel.app/api/proxy

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/examples/tree/main/edge-functions/authed-proxy&project-name=authed-proxy&repository-name=)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/edge-functions/authed-proxy edge-authentication-proxy
# or
yarn create next-app --example https://github.com/vercel/examples/tree/main/edge-api-functions/authed-proxy edge-authentication-proxy
```

Install the Vercel CLI:

```bash
npm i -g vercel
```

Then run the app at the root of the repository:

```bash
vercel dev
```
