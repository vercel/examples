# Serverside Analytics

This example shows how to use [Segment](https://segment.com) to implement server-side analytics at the edge with [Next.js Middleware](https://nextjs.org/docs/middleware).

## Demo

https://edge-serverside-analytics.vercel.app/

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/examples/tree/main/edge-functions/serverside-analytics&project-name=serverside-analytics&repository-name=serverside-analytics)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/edge-functions/serverside-analytics
# or
yarn create next-app --example https://github.com/vercel/examples/tree/main/edge-functions/serverside-analytics

```

### Setting up Segment

1.Register and create a workspace at [segment.com](https://segment.com)
2.Add a [javascript source](https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/) and grab the `writeKey`
3.Add the write key in your `.env` file.

Next, run Next.js in development mode:

```bash
npm install
npm run dev

# or

yarn
yarn dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
