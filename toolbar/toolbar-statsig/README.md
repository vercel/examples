---
name: Vercel Toolbar x Statsig example
slug: toolbar-statsig
description: Learn how to set up the Statsig with the Vercel Toolbar
framework: Next.js
useCase: Vercel Toolbar
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/toolbar/toolbar-statsig&project-name=toolbar-statsig&repository-name=toolbar-statsig&env=STATSIG_CONSOLE_API_KEY&env=STATSIG_SERVER_API_KEY&env=STATSIG_PROJECT_ID&env=FLAGS_SECRET
demoUrl: https://toolbar-statsig.vercel.app
relatedTemplates:
  - toolbar-launchdarkly
  - toolbar-optimizely
  - toolbar-split
---

# toolbar-statsig example

This example shows how to combine the Vercel Toolbar with Statsig in Next.js.

You will need to provide the `STATSIG_CONSOLE_API_KEY`, `STATSIG_SERVER_API_KEY`, and `STATSIG_PROJECT_ID` environment variables.

You will also need to provide a `FLAGS_SECRET` environment variable. You can generate one with `node -e "console.log(crypto.randomBytes(32).toString('base64url'))"`.

When running locally, you will need to run `vercel link` to link one of your Vercel projects. The environment variables mentioned above need to be defined on the linked project in the Vercel dashboard. Having them in local `.env` files is not enough.

## Demo

https://toolbar-statsig.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/toolbar/toolbar-statsig&project-name=toolbar-statsig&repository-name=toolbar-statsig&env=STATSIG_CONSOLE_API_KEY&env=STATSIG_SERVER_API_KEY&env=STATSIG_PROJECT_ID&env=FLAGS_SECRET)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/toolbar/toolbar-statsig
```

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=toolbar-statsig) ([Documentation](https://nextjs.org/docs/deployment)).
