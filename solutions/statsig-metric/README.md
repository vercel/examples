# statsig-metric example

This example shows how to use [Statsig Metrics](https://docs.statsig.com/metrics) in Next.js

## Demo

https://statsig-metric.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/examples/tree/main/solutions/statsig-metric&project-name=statsig-metric&repository-name=statsig-metric)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/solutions/statsig-metric
# or
yarn create next-app --example https://github.com/vercel/examples/tree/main/solutions/statsig-metric
```

Set your environment variables.

1. Log in to the [Statsig console](https://console.statsig.com/) and navigate to
   - Settings
   - API KEYS
2. Copy your Client API keys and paste it in [.env.example](./env.example)
3. Rename `.env.example` to `.env.local`

Next, run Next.js in development mode:

```bash
npm install
npm run dev

# or

yarn
yarn dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
