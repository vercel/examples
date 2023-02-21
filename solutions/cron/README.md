---
name: Vercel Cron Job Example
slug: vercel-cron
description: A Next.js app that uses Vercel Cron Jobs to update data at different intervals.
framework: Next.js
useCase:
  - Cron
  - Edge Functions
  - Edge Config
css: Tailwind
demoUrl: https://cron.vercel.app/
relatedTemplates:
  - hacker-news-slack-bot
---

# Vercel Cron Job Example

A Next.js app that uses [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs) to update data at different intervals.

## Demo

https://cron.vercel.app/

## How to Use

You can choose from one of the following two methods to use this repository:

### 1. Set Up Environment variables

You'll need to complete the following steps to get the required environment variables:

1. Follow [these steps](https://vercel.com/docs/concepts/edge-network/edge-config/get-started#create-an-edge-config-in-your-account) to configure your Edge Config store. This should give you both the `EDGE_CONFIG_ID` and the `EDGE_CONFIG_URL` variables.

2. Get your remaining environment variables:

- `TEAM_ID_VERCEL`: The Vercel Team ID you created the Edge Config store under. If you're creating this under your personal account, you can omit this variable.
- `ACCESS_TOKEN_VERCEL`: Your Vercel Personal Access Token scoped to your appropriate Vercel Team.

### 2. Deploy to Vercel

**One-Click Deploy**

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=examples-repo):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/cron&project-name=cron&repository-name=cron)

Don't forget to set the required environment variables that you got from the previous step.

**Clone and Deploy**

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/solutions/cron cron
# or
yarn create next-app --example https://github.com/vercel/examples/tree/main/solutions/cron cron
```

Next, run Next.js in development mode:

```bash
npm install
npm run dev

# or

yarn
yarn dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=examples-repo) ([Documentation](https://nextjs.org/docs/deployment)).
