---
name: A/B testing with Statsig
slug: ab-testing-statsig
description: Learn how to do A/B testing at the edge using Statsig.
framework: Next.js
useCase: Edge Functions
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-functions/ab-testing-statsig&project-name=ab-testing-statsig&repository-name=ab-testing-statsig&env=STATSIG_SERVER_API_KEY,NEXT_PUBLIC_STATSIG_CLIENT_KEY&envDescription=API%20keys%20used%20by%20statsig%20on%20the%20server%20and%20the%20client&envLink=https%3A%2F%2Fconsole.statsig.com
demoUrl: https://edge-ab-testing-statsig.vercel.app
---

# A/B testing with Statsig

This example shows how to do A/B testing at the edge using [Statsig](https://www.statsig.com/).

## Demo

https://edge-ab-testing-statsig.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

After [setting up your environment variables](#set-up-environment-variables), deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/examples/tree/main/edge-functions/ab-testing-statsig&project-name=ab-testing-statsig&repository-name=ab-testing-statsig&env=STATSIG_SERVER_API_KEY,NEXT_PUBLIC_STATSIG_CLIENT_KEY&envDescription=API%20keys%20used%20by%20statsig%20on%20the%20server%20and%20the%20client&envLink=https%3A%2F%2Fconsole.statsig.com)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/edge-functions/ab-testing-statsig
# or
yarn create next-app --example https://github.com/vercel/examples/tree/main/edge-functions/ab-testing-statsig
```

#### Set up environment variables

1. Log in to the [Statsig console](https://console.statsig.com/) and navigate to
   - Settings
   - API KEYS
2. Copy your Client API keys and paste it in [.env.example](./env.example)
3. Rename `.env.example` to `.env.local`
   ```bash
   cp .env.example .env.local
   ```

Next, run Next.js in development mode:

```bash
npm install
npm run dev

# or

yarn
yarn dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
