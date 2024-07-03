---
name: Vercel Toolbar Feature Flags SvelteKit Starter
slug: toolbar-feature-flags-sveltekit
description: Simple SvelteKit template that uses the Vercel Toolbar and Feature Flags.
framework: Svelte
useCase: Starter
css: None
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/toolbar/toolbar-feature-flags-sveltekit&project-name=toolbar-feature-flags-sveltekit&repository-name=toolbar-feature-flags-sveltekit&env=FLAGS_SECRET
demoUrl: https://toolbar-feature-flags-sveltekit.vercel.app/
relatedTemplates:
  - toolbar-launchdarkly
  - toolbar-optimizely
  - toolbar-split
  - toolbar-statsig
---

# Vercel Toolbar Flags SvelteKit Starter

Simple SvelteKit template that uses the [Vercel Toolbar](https://vercel.com/docs/workflow-collaboration/vercel-toolbar) and [Feature Flags](https://vercel.com/docs/workflow-collaboration/feature-flags).

## Demo

https://toolbar-feature-flags-sveltekit.vercel.app/

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

In your local environment, connect to your created project using `vercel link` and then pull your environment variables with `vercel env pull`.

Next, run SvelteKit in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples) ([Documentation](https://vercel.com/docs/frameworks/sveltekit)).
