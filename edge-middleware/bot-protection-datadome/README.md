---
name: Bot Protection with DataDome
slug: bot-protection-datadome
description: DataDome can provide real-time bot protection and other security protections to any website. In this template we'll be using it at the edge.
framework: Next.js
useCase: Edge Middleware
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel-customer-feedback%2Fedge-middleware%2Ftree%2Fmain%2Fexamples%2Fbot-protection-datadome&env=NEXT_PUBLIC_DATADOME_CLIENT_SIDE_KEY,DATADOME_SERVER_SIDE_KEY&project-name=bot-protection-datadome&repository-name=bot-protection-datadome
demoUrl: https://edge-functions-bot-protection-datadome.vercel.app
ignoreE2E: true
relatedTemplates:
  - api-rate-limit-and-tokens
  - bot-protection-botd
---

# Bot Protection with DataDome

[DataDome](https://datadome.co/) can provide real-time bot protection and other security protections to any website. In this demo we'll be using it at the edge.

## Demo

https://edge-functions-bot-protection-datadome.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel-customer-feedback%2Fedge-middleware%2Ftree%2Fmain%2Fexamples%2Fbot-protection-datadome&env=NEXT_PUBLIC_DATADOME_CLIENT_SIDE_KEY,DATADOME_SERVER_SIDE_KEY&project-name=bot-protection-datadome&repository-name=bot-protection-datadome)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/edge-middleware/bot-protection-datadome bot-protection-datadome
```

You'll need to have an account with [DataDome](https://datadome.co/free-signup/). Once that's done, copy the `.env.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.example .env.local
```

Then open `.env.local` and set the environment variables to match the ones in your DataDome dashboard. Your keys should be available at https://app.datadome.co/dashboard/config/protection/keys

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
