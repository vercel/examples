# logging example

This example shows how to implement logging at the edge using [Logtail](https://betterstack.com/logtail).

## Demo

https://edge-logging.vercel.app

## How to Use

### Fill environment variables

Rename `.env.example` to `.env.local` and fill `LOGTAIL_TOKEN` with your [Logtail](https://logtail.com) token.

### Deploy

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/examples/tree/main/edge-functions/logging&project-name=logging&repository-name=logging

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/edge-functions/logging
# or
yarn create next-app --example https://github.com/vercel/examples/tree/main/edge-functions/logging
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
