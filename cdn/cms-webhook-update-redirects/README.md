---
name: Redirects updated on CMS webhook
slug: cms-webhook-update-redirects
description: Updates project-level redirects from CMS using webhook + Vercel SDK
framework: Next.js
useCase: Redirects
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/cdn/cms-webhook-update-redirects&project-name=cms-webhook-update-redirects&repository-name=cms-webhook-update-redirects&env=VERCEL_TEAM_ID,VERCEL_PROJECT_ID,VERCEL_BEARER_TOKEN
demoUrl: https://cms-webhook-update-redirects.vercel.app
---

# Update Vercel redirects on CMS changes

This example shows how to respond to CMS webhook events to update redirects served on Vercel.

## Demo

https://cms-webhook-update-redirects.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/cdn/cms-webhook-update-redirects&project-name=cms-webhook-update-redirects&repository-name=cms-webhook-update-redirects&env=VERCEL_TEAM_ID,VERCEL_PROJECT_ID,VERCEL_BEARER_TOKEN)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/cdn/cms-webhook-update-redirects
```

Next, run Next.js in development mode:

```bash
pnpm dev
```

## Environment variables

- `VERCEL_TEAM_ID` – Vercel team ID to update redirects for
- `VERCEL_PROJECT_ID` – Vercel project ID to update redirects for
- `VERCEL_BEARER_TOKEN` - Vercel access token for this team

## How it works

1. The Vercel project runs in production as normal. It can optionally use [Build-time redirects via a CMS](https://vercel.com/templates/cdn/bulk-redirects-via-a-cms) example to load some redirects at deployment time.
2. When a redirect is updated on the CMS, a webhook handler receives a request with the updated redirect. That code uses the [Vercel SDK](https://vercel.com/docs/rest-api/reference/sdk) to modify the redirects served by Vercel. This can happen without a new deployment.
3. After creating a new redirect, the webhook handler then promotes that new version to production with the changed value. Redirects are created in a staged version and must be explicitly promoted to production before being served to end users.
