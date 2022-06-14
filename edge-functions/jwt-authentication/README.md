---
name: JWT Authentication
slug: jwt-authentication
description: Learn how to do JWT authentication at the edge.
framework: Next.js
useCase:
  - Edge Functions
  - Documentation
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fedge-functions%2Fjwt-authentication&env=JWT_SECRET_KEY&envDescription=Random%20secret%20that'll%20be%20used%20to%20sign%20JWTs&project-name=jwt-authentication&repo-name=jwt-authentication
demoUrl: https://edge-functions-jwt-authentication.vercel.app
---

# JWT Authentication

The example shows how to do JWT authentication at the edge.

## Demo

https://edge-functions-jwt-authentication.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

After [setting up your JWT secret](#set-up-environment-variables), deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fedge-functions%2Fjwt-authentication&env=JWT_SECRET_KEY&envDescription=Random%20secret%20that'll%20be%20used%20to%20sign%20JWTs&project-name=jwt-authentication&repo-name=jwt-authentication)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/edge-functions/jwt-authentication
# or
yarn create next-app --example https://github.com/vercel/examples/tree/main/edge-functions/jwt-authentication
```

#### Set up environment variables

Rename [`.env.example`](.env.example) to `.env.local`:

```bash
cp .env.example .env.local
```

then, update `JWT_SECRET_KEY` with your a random secret that'll be used to sign JWTs.

Next, run Next.js in development mode:

```bash
npm install
npm run dev

# or

yarn
yarn dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
