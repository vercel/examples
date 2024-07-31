---
name: Domains API
slug: domains-api
description: Learn how to use Vercel's Domains API to add or remove domains programmatically from your Vercel app.
framework: Next.js
useCase: Documentation
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/domains-api&project-name=domains-api&repository-name=domains-api&env=AUTH_BEARER_TOKEN,PROJECT_ID_VERCEL,TEAM_ID_VERCEL
demoUrl: https://domains-api.vercel.app
relatedTemplates:
  - platforms-starter-kit
---

# Domains API

This template shows how you can use Vercel's Domains API to add and remove domains programmatically from your Vercel app.

## Deploy your own

Deploy the template using [Vercel](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/domains-api&project-name=domains-api&repository-name=domains-api&env=AUTH_BEARER_TOKEN,PROJECT_ID_VERCEL,TEAM_ID_VERCEL) [view the demo](https://domains-api.vercel.app/), or read the [documentation](https://vercel.com/docs/rest-api/endpoints/domains).

## Features

### 1. Configure Environment Variables

You'll need to configure the follow environment variables for this project to work:

- `PROJECT_ID_VERCEL`: The ID of the Vercel Project you want to add or remove domains from. Lean how to [find your Vercel Project ID](https://vercel.com/docs/projects/overview#project-id).
- `TEAM_ID_VERCEL`: The ID of the Vercel Team you want to add or remove domains from. Lean how to [find your Vercel Team ID](https://vercel.com/docs/accounts/create-a-team#find-your-team-id).
- `AUTH_BEARER_TOKEN`: A token that allows programmatic access to your Vercel account. Lean how to [create a Vercel Acces Token](https://vercel.com/docs/rest-api#creating-an-access-token).

### 2. Adding Domains

To add a domain, you can use the `/v8/projects/{idOrName}/domains` endpoint as shown [here](./pages/api/add-domain.js) ([full documentation](https://vercel.com/docs/rest-api#endpoints/projects/add-a-domain-to-a-project)).

When a domain is added, there are 3 possible outcomes:

1. Domain is added successfully (response code `200`).
2. Domains is already in use by another project and can't be added (response code `409`).
3. Domains belongs to a different team but you can potentially request delegation for the domain (response code `403`).

#### Verifying Project Domain

Verifying a project domain can be done with the `/v9/projects/{projectId}/domains/{domain}/verify` endpoint as shown [here](./pages/api/verify-domain.js) ([full documentation](https://vercel.com/docs/rest-api#endpoints/projects/verify-project-domain)).

### 3. Auto-checking Domain Configuration

When a domain is first added to a project, we use [SWR](https://swr.vercel.app) to periodically check if the domain's DNS records are configured correctly. This is done using the `/v6/domains/{domain}/config` endpoint as shown [here](./pages/api/check-domain.js).

There are two ways that your users can configure their domains after they are added:

- CNAME record:
  - recommended for subdomains (blog.domain.com, app.domain.com)
  - you can set up a branded CNAME value by adding an `A` record for the `cname` subdomain on your domain and point it to to Vercel's IP address `76.76.21.21`
- A record:
  - recommended for apex domains (domain.com)

Example:
![CleanShot 2021-12-08 at 19 00 52](https://user-images.githubusercontent.com/28986134/145327099-137dc60e-d260-4ba3-b8bb-413e7d70b9b1.png)

### 4. Removing Domains

To remove a domain, you can use the `/v8/projects/{idOrName}/domains` endpoint as shown [here](./pages/api/remove-domain.js) ([full documentation](https://vercel.com/docs/rest-api#endpoints/projects/remove-a-domain-from-a-project)).

## How to Use

You can choose from one of the following methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=platforms-eap):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/domains-api&project-name=domains-api&repository-name=domains-api&env=AUTH_BEARER_TOKEN,PROJECT_ID_VERCEL,TEAM_ID_VERCEL)

### Clone and Deploy

Use [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/solutions/domains-api domains-api
```

Then, run Next.js in development mode:

```bash
npm run dev
```

When you're ready to deploy to [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=platforms-eap), install and use the [Vercel CLI](https://vercel.com/docs/cli) to create a new project and deployment.

```bash
vercel deploy
```
