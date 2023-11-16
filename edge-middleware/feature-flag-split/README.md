---
name: Split Integration example
slug: ab-testing-split
description: Learn to use Split, a feature delivery platform that powers feature flag management, software experimentation and continuous delivery.
framework: Next.js
useCase: Edge Middleware
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/feature-flag-split&env=SPLIT_SDK_CLIENT_API_KEY,EDGE_CONFIG,EDGE_CONFIG_SPLIT_ITEM_KEY&project-name=feature-flag-split&repository-name=feature-flag-split&integration-ids=oac_bic40oWF5k9pDFboJhKYqMd1&edge-config-stores=%7B%22EDGE_CONFIG%22%3A%7B%7D%7D
demoUrl: https://ab-testing-split.vercel.app
relatedTemplates:
  - maintenance-page
  - feature-flag-apple-store
---

# A/B Testing with Split

[Split](https://www.split.io/) is a feature delivery platform that powers feature flag management, software experimentation and continuous delivery.

## Demo

https://ab-testing-split.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/feature-flag-split&env=SPLIT_SDK_CLIENT_API_KEY,EDGE_CONFIG,EDGE_CONFIG_SPLIT_ITEM_KEY&project-name=feature-flag-split&repository-name=feature-flag-split&integration-ids=oac_bic40oWF5k9pDFboJhKYqMd1&edge-config-stores=%7B%22EDGE_CONFIG%22%3A%7B%7D%7D)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/edge-middleware/feature-flag-split feature-flag-split
```

You'll need to have an account with [Split](https://www.split.io/signup/). Once that's done, copy the `.env.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.example .env.local
```

Then open `.env.local` and set the environment variables to match the ones in your Split dashboard. Your keys should be available under Workspace settings - API Keys, in the admin settings of your organization.

#### Set up environment variables

Copy [.env.example](./env.example) to `.env.local`:

```bash
cp .env.example .env.local
```

Then fill it with the following information:

- Log in to the [Split console](https://app.split.io/login) and navigate to **Profile -> Admin Settings -> API Keys -> SDK API Keys** to retreive your SDK API Key.

- Install the [Split Vercel Integration](https://vercel.com/integrations/split) for your project.
  Then fill in `.env.local` with the provided Edge Config Item Key.

- You can find the Edge Config Connection String on vercel.com -> Storage -> \[Your Edge Config\] -> Projects. You can click Connect Project if your Edge Config is not connected to any project yet. This will automatically create a token for you and set it up as an environment variable on your project. Note that you still need to provide it to your `.env.local` file. Otherwise, click on Tokens in the sidebar and find the token you want to use. Then click on the three dots of and select Copy Connection String.

- You also need to create feature flags called `New_Marketing_Page` and `New_About_Page`. You can set the user targeting to `Joe` and `Bobby` in whatever configuration you'd like as those users are used by this example.

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
