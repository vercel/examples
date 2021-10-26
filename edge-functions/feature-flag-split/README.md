# A/B Testing with Split

[Split](https://www.split.io/) is a feature delivery platform that powers feature flag management, software experimentation, and continuous delivery.

## Demo

https://edge-functions-feature-flag-split.vercel.sh

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-functions/feature-flag-split&env=SPLIT_ADMIN_API_KEY,SPLIT_WORKSPACE_ID,SPLIT_ENVIRONMENT_ID,NEXT_PUBLIC_SPLIT_SDK_CLIENT_API_KEY&project-name=feature-flag-split&repository-name=feature-flag-split)

## Getting Started

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/edge-functions/feature-flag-split feature-flag-split
# or
yarn create next-app --example https://github.com/vercel/examples/tree/main/edge-functions/feature-flag-split feature-flag-split
```

You'll need to have an account with [Split](https://www.split.io/signup/). Once that's done, copy the `.env.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.example .env.local
```

Then open `.env.local` and set the environment variables to match the ones in your Split dashboard. Your keys should be available under Workspace settings - API Keys, in the admin settings of your organization.

Next, run Next.js in development mode:

```bash
npm install
npm run dev

# or

yarn
yarn dev
```
