---
marketplace: false
---

# Clerk Authentication at the edge

This demo features authentication at the edge using [Clerk](https://clerk.dev/?utm_source=vercel&utm_medium=github&utm_campaign=edge-authentication).

## Demo

https://edge.clerk.app/

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/clerk-authentication&env=NEXT_PUBLIC_CLERK_FRONTEND_API,CLERK_API_KEY,CLERK_JWT_KEY&project-name=clerk-authentication&repo-name=clerk-authentication)

## Getting Started

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/edge-middleware/clerk-authentication clerk-authentication
# or
yarn create next-app --example https://github.com/vercel/examples/tree/main/edge-middleware/clerk-authentication clerk-authentication
```

You'll need to have an account with [Clerk](https://clerk.dev/?utm_source=vercel&utm_medium=github&utm_campaign=edge-authentication). Once that's done, copy the `.env.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.example .env.local
```

Then open `.env.local` and set the environment variables to match the settings of your Clerk application. It should look something like this (replace the values with your own Clerk's dashboard):

```bash
NEXT_PUBLIC_CLERK_FRONTEND_API=foo.bar.lcl.dev
CLERK_API_KEY=test_lcyh0EbavaYPZBnyUbRBGtSo1dELNxJSLC
CLERK_JWT_KEY=YOUR_CLERK_JWT_KEY_GOES_HERE
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
