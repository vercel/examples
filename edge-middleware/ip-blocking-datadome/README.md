---
name: IP Blocking with DataDome
slug: ip-blocking-datadome
description: DataDome can provide real-time bot protection, ip blocking, custom rules protection and other security protections to any website.
framework: Next.js
useCase: Edge Middleware
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel-customer-feedback%2Fedge-middleware%2Ftree%2Fmain%2Fexamples%2Fip-blocking-datadome&env=NEXT_PUBLIC_DATADOME_CLIENT_KEY,DATADOME_SERVER_KEY,DATADOME_MANAGEMENT_KEY&project-name=ip-blocking-datadome&repository-name=ip-blocking-datadome
demoUrl: https://edge-functions-ip-blocking-datadome.vercel.app
ignoreE2E: true
relatedTemplates:
  - bot-protection-botd
  - bot-protection-datadome
  - ip-blocking
---

# IP Blocking with DataDome

[DataDome](https://datadome.co/) can provide real-time bot protection, ip blocking, custom rules protection and other security protections to any website.

This demo shows features:

- IP Blocking
- Protection through Custom Rules

## Demo

https://edge-functions-ip-blocking-datadome.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel-customer-feedback%2Fedge-middleware%2Ftree%2Fmain%2Fexamples%2Fip-blocking-datadome&env=NEXT_PUBLIC_DATADOME_CLIENT_KEY,DATADOME_SERVER_KEY,DATADOME_MANAGEMENT_KEY&project-name=ip-blocking-datadome&repository-name=ip-blocking-datadome)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/edge-middleware/ab-testing-simple ab-testing-simple
```

You'll need to have an account with [DataDome](https://datadome.co/free-signup/). Once that's done, copy the `.env.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.example .env.local
```

Then open `.env.local` and set the environment variables to match the ones in your DataDome dashboard. Your keys should be available at https://app.datadome.co/dashboard/config/protection/keys.

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
