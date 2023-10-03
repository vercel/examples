---
name: Basic Auth Password Protection
slug: basic-auth-password
description: Password protect pages in your application using Edge Middleware.
framework: Next.js
useCase: Edge Middleware
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/basic-auth-password&project-name=basic-auth-password&repository-name=basic-auth-password
demoUrl: https://edge-functions-basic-auth-password.vercel.app
relatedTemplates:
  - jwt-authentication
  - subdomains-auth
---

# Basic Auth Password Protection

Password protect pages in your application using Edge Middleware.

## Demo

https://edge-functions-basic-auth-password.vercel.app

Login credentials:

- Username: `4dmin`
- Password: `testpwd123`

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/basic-auth-password&project-name=basic-auth-password&repository-name=basic-auth-password)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/edge-middleware/basic-auth-password basic-auth-password
```

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
