---
name: Maintenance Page
slug: maintenance-page
description: This template shows how to quickly trigger a maintenance page using Edge Config
framework: Next.js
useCase:
  - Edge Middleware
  - Edge Config
css: Tailwind
deployUrl: 'https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fedge-middleware%2Fmaintenance-page&project-name=maintenance-page&repo-name=maintenance-page&env=EDGE_CONFIG&edge-config-stores=%7B%22EDGE_CONFIG%22%3A%7B%22isInMaintenanceMode%22%3Atrue%7D%7D'
demoUrl: https://edge-maintenance-page.vercel.app/
relatedTemplates:
  - feature-flag-apple-store
  - nextjs-boilerplate
---

# maintenance-page example

This example shows how to implement a maintenance page on the edge

## Demo

https://edge-maintenance-page.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/maintenance-page&project-name=maintenance-page&repository-name=maintenance-page&env=EDGE_CONFIG&edge-config-stores=%7B%22EDGE_CONFIG%22%3A%7B%22isInMaintenanceMode%22%3Atrue%7D%7D)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/edge-middleware/maintenance-page
```

#### Set up environment variables

Copy the `.env.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.example .env.local
```

This example requires you to set up an Edge Config and store its connection string in the `EDGE_CONFIG` environment variable. Fill the Edge Config you create with this content:

```json
{ "isInMaintenanceMode": true }
```

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
