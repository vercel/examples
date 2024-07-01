---
name: Vercel Toolbar Feature Flags SvelteKit Starter
slug: toolbar-feature-flags-sveltekit
description: Simple SvelteKit template that uses the Vercel Toolbar and Feature Flags.
framework: Svelte
useCase: Starter
css: None
deployUrl: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fstorage%2Fpostgres-sveltekit&project-name=postgres-sveltekit&repository-name=postgres-sveltekit&demo-title=Vercel%20Postgres%20Starter%sveltekit&demo-description=Simple%20Svelte.js%20template%20that%20uses%20Vercel%20Postgres%20as%20the%20database.&demo-url=https%3A%2F%2Fpostgres-sveltekit.vercel.app%2F&demo-image=https%3A%2F%2Fpostgres-starter.vercel.app%2Fopengraph-image.png&stores=%5B%7B"type"%3A"postgres"%7D%5D
demoUrl: TODO-DEMO-URL
relatedTemplates:
  - toolbar-launchdarkly
  - toolbar-optimizely
  - toolbar-split
  - toolbar-statsig
---

# Vercel Toolbar Flags SvelteKit Starter

Simple SvelteKit template that uses the [Vercel Toolbar](https://vercel.com/docs/workflow-collaboration/vercel-toolbar) and [Feature Flags](https://vercel.com/docs/workflow-collaboration/feature-flags).

## Demo

TODO-DEMO-URL

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/toolbar/toolbar-feature-flags-sveltekit&project-name=toolbar-feature-flags-sveltekit&repository-name=toolbar-feature-flags-sveltekit&env=FLAGS_SECRET)

### Clone and Deploy

Execute the following command to download the example into the `my-project` folder:

```bash
npx degit@latest https://github.com/vercel/examples/toolbar/toolbar-feature-flags-sveltekit my-project
```

After installing the dependencies using `pnpm install`, create a new project in your Vercel Dashboard. In your project's settings, create an environment variable called `FLAGS_SECRET`. The value must have a specific length (32 random bytes encoded in base64) to work as an encryption key. You can create one using node:

```bash
node -e "console.log(crypto.randomBytes(32).toString('base64url'))"
```

In your local environment, pull your environment variables with vercel env pull to make them available to your project.

Next, run SvelteKit in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples) ([Documentation](https://vercel.com/docs/frameworks/sveltekit)).
