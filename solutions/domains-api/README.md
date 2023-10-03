---
name: Domains API
slug: domains-api
description: Learn to leverage Vercel's Domains API to add and remove domains programmatically from your Platforms on Vercel project.
framework: Next.js
useCase: Documentation
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/domains-api&project-name=domains-api&repository-name=domains-api&env=AUTH_BEARER_TOKEN,PROJECT_ID_VERCEL,TEAM_ID_VERCEL
demoUrl: https://domains-api.vercel.app
relatedTemplates:
  - platforms-starter-kit
---

# Domains API

This code snippet shows you how you can leverage Vercel's Domains API to add and remove domains programmatically from your Platforms on Vercel project.

## Dependencies

- Tailwind CSS (`npm install tailwindcss`)
- SWR (`npm install swr`)
- React Hot Toast (`npm install react-hot-toast`) (optional)
- JS Cookie (`npm install js-cookie`) (optional)

## Demo

https://domains-api.vercel.app/

## Features

### 0. Configure Env Vars

You'll need to configure 3 different environment variables for this project to work:

- `PROJECT_ID_VERCEL`: The ID of the Vercel project you want to add/remove domains from. You can find it under the "Settings" tab in your project's dashboard.
- `TEAM_ID_VERCEL`: The ID of the Vercel team you want to add/remove domains from. You can find it under the "Settings" tab in your team's dashboard.
- `AUTH_BEARER_TOKEN`: Your personal auth bearer token that gives you programmatic access to your Vercel account. You can create one under the "Tokens" tab in your personal account's settings tab.

### 1. Adding Domains

To add a domain, you can use the `/v8/projects/{idOrName}/domains` endpoint as shown [here](./pages/api/add-domain.js) ([full documentation](https://vercel.com/docs/rest-api#endpoints/projects/add-a-domain-to-a-project)).

When a domain is added, there are 3 possible outcomes:

1. Domain is added successfully (response code `200`).
2. Domains is already in use by another project and can't be added (response code `409`).
3. Domains belongs to a different team but you can potentially request delegation for the domain (response code `403`).

#### Verifying Project Domain

Verifying a project domain can be done with the `/v9/projects/{projectId}/domains/{domain}/verify` endpoint as shown [here](./pages/api/verify-domain.js) ([full documentation](https://vercel.com/docs/rest-api#endpoints/projects/verify-project-domain)).

### 2. Auto-checking Domain Configuration

When a domain is first added to a project, we use [SWR](https://swr.vercel.app) to periodically check if the domain's DNS records are configured correctly. This is done using the `/v6/domains/{domain}/config` endpoint as shown [here](./pages/api/check-domain.js).

There are two ways that your users can configure their domains after they are added:

- CNAME record:
  - recommended for subdomains (blog.domain.com, app.domain.com)
  - you can set up a branded CNAME value by adding an `A` record for the `cname` subdomain on your domain and point it to to Vercel's IP address `76.76.21.21`
- A record:
  - recommended for apex domains (domain.com)

Example:
![CleanShot 2021-12-08 at 19 00 52](https://user-images.githubusercontent.com/28986134/145327099-137dc60e-d260-4ba3-b8bb-413e7d70b9b1.png)

### 3. Removing Domains

To remove a domain, you can use the `/v8/projects/{idOrName}/domains` endpoint as shown [here](./pages/api/remove-domain.js) ([full documentation](https://vercel.com/docs/rest-api#endpoints/projects/remove-a-domain-from-a-project)).

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=platforms-eap):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/domains-api&project-name=domains-api&repository-name=domains-api&env=AUTH_BEARER_TOKEN,PROJECT_ID_VERCEL,TEAM_ID_VERCEL)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/solutions/domains-api domains-api
```

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=platforms-eap) ([Documentation](https://nextjs.org/docs/deployment)).
