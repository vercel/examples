# Analytics at the edge

This example shows how to use [Segment](https://segment.com) to implement analytics at the edge with [Next.js Middleware](https://nextjs.org/docs/middleware).

## Demo

https://edge-functions-analytics.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/examples/tree/main/edge-functions/analytics&project-name=analytics&repository-name=analytics&env=SEGMENT_WRITE_KEY&envDescription=A%20Segment%20write%20key&envLink=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Ffeat%2Fanalytics%2Fedge-functions%2Fanalytics%23setting-up-segment)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/edge-functions/analytics
# or
yarn create next-app --example https://github.com/vercel/examples/tree/main/edge-functions/analytics

```

### Setting up Segment

1. Register and create a workspace at [segment.com](https://segment.com)
1. When on the segment dashboard create a new source:
   1. Select the `Source` menu on the left hand side
   1. Select `Add Source` and there select `Javascript` under the Website section.
   1. Give a name to your source. Fill in the other fields if you desire, only name is required.
   1. confirm the creation of the source.
1. After having created the source you can find the `writeKey` under `Settings` => `API keys` menu of your new source.

```bash
cp .env.example .env
```

4. set your write key in `SEGMENT_WRITE_KEY`

```bash
SEGMENT_WRITE_KEY="<your-write-key>"
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
