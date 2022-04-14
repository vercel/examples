---
marketplace: false
---

# A/B Testing with PostHog

[PostHog](https://posthog.com/) is an open-source product analytics platform that offers a suite of tools, including funnels, heat maps, session recording, feature flags and more, all in a single platform.

## Demo

https://edge-functions-feature-flag-posthog.vercel.sh

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-functions/feature-flag-posthog&env=NEXT_PUBLIC_POSTHOG_PROJECT_API_KEY,NEXT_PUBLIC_POSTHOG_HOST&project-name=feature-flag-posthog&repository-name=feature-flag-posthog)

## Getting Started

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/edge-functions/feature-flag-posthog feature-flag-posthog
# or
yarn create next-app --example https://github.com/vercel/examples/tree/main/edge-functions/feature-flag-posthog feature-flag-posthog
```

You'll need to have an account with [PostHog](https://posthog.com/signup). Once that's done, copy the `.env.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.example .env.local
```

Then open `.env.local` and set the environment variables to match the host for your PostHog instance and the Project API key available under Project settings - Project API Key.

Next, run Next.js in development mode:

```bash
npm install
npm run dev

# or

yarn
yarn dev
```
