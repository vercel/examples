---
name: Vercel Toolbar x LaunchDarkly example
slug: toolbar-launchdarkly
description: Learn how to set up the LaunchDarkly with the Vercel Toolbar
framework: Next.js
useCase: Vercel Toolbar
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/toolbar/toolbar-launchdarkly&project-name=toolbar-launchdarkly&repository-name=toolbar-launchdarkly&env=LAUNCHDARKLY_API_KEY&env=LAUNCHDARKLY_SDK_KEY&env=LAUNCHDARKLY_ENV&env=LAUNCHDARKLY_PROJECT_KEY&env=FLAGS_SECRET
demoUrl: https://toolbar-launchdarkly.vercel.app
relatedTemplates:
  - toolbar-optimizely
  - toolbar-split
  - toolbar-statsig
---

# toolbar-launchdarkly example

This example shows how to combine the Vercel Toolbar with LaunchDarkly in Next.js.

You will need to provide the `LAUNCHDARKLY_API_KEY`, `LAUNCHDARKLY_SDK_KEY`, `LAUNCHDARKLY_ENV`, and `LAUNCHDARKLY_PROJECT_KEY` environment variables.

You will also need to provide a `FLAGS_SECRET` environment variable. You can generate one with `node -e "console.log(crypto.randomBytes(32).toString('base64url'))"`.

When running locally, you will need to run `vercel link` to link one of your Vercel projects. The environment variables mentioned above need to be defined on the linked project in the Vercel dashboard. Having them in local `.env` files is not enough.

## Demo

https://toolbar-launchdarkly.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/toolbar/toolbar-launchdarkly&project-name=toolbar-launchdarkly&repository-name=toolbar-launchdarkly&env=LAUNCHDARKLY_API_KEY&env=LAUNCHDARKLY_SDK_KEY&env=LAUNCHDARKLY_ENV&env=LAUNCHDARKLY_PROJECT_KEY&env=FLAGS_SECRET)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/toolbar/toolbar-launchdarkly
```

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=toolbar-launchdarkly) ([Documentation](https://nextjs.org/docs/deployment)).
