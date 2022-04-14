---
name: Feature Flag Apple Store
slug: feature-flag-apple-store
description: This template uses Upstash (Edge Redis Database) as storage for controlling whether the Apple Store is open or closed.
framework: Next.js
useCase: Edge Functions
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fedge-functions%2Ffeature-flag-apple-store&env=UPSTASH_SECRET&envDescription=The%20Upstash%20secret%20from%20your%20Upstash%20console&envLink=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fedge-functions%2Ffeature-flag-apple-store%23set-up-environment-variables&project-name=feature-flag-apple-store&repo-name=feature-flag-apple-store
demoUrl: https://edge-functions-feature-flag-apple-store.vercel.app
---

# Apple Store

This examples uses [Upstash](https://upstash.com/) (Edge Redis Database) as storage for controlling whether the Apple Store is open or closed.

## Demo

https://edge-functions-feature-flag-apple-store.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

After [setting up your environment variables](#set-up-environment-variables), deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fedge-functions%2Ffeature-flag-apple-store&env=UPSTASH_SECRET&envDescription=The%20Upstash%20secret%20from%20your%20Upstash%20console&envLink=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fedge-functions%2Ffeature-flag-apple-store%23set-up-environment-variables&project-name=feature-flag-apple-store&repo-name=feature-flag-apple-store)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/edge-functions/feature-flag-apple-store
# or
yarn create next-app --example https://github.com/vercel/examples/tree/main/edge-functions/feature-flag-apple-store
```

#### Set up environment variables

Get your upstash secret from the console, then rename [`.env.example`](.env.example) to `.env.local`:

```bash
cp .env.example .env.local
```

and update `UPSTASH_SECRET` with your secret.

Next, run Next.js in development mode:

```bash
npm install
npm run dev

# or

yarn
yarn dev
```

## Opening / Closing the Store

We can use Upstash's REST API to update the kev/value store. Replace the URLs and Authorization tokens below with the values from your Upstash Redis instance.

**Open**

```bash
$ curl https://your-upstash-url.upstash.io/set/store-closed/false -H "Authorization: Bearer YOUR_TOKEN"
```

**Closed**

```bash
$ curl https://your-upstash-url.upstash.io/set/store-closed/true -H "Authorization: Bearer YOUR_TOKEN"
```
