---
name: Hostname Rewrites using Edge Middleware
slug: hostname-rewrites
description: Learn how to programmatically create unique content pages for your users with a multi-tenant infrastructure using Edge Middleware.
framework: Next.js
useCase:
  - Edge Middleware
  - Documentation
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/hostname-rewrites&project-name=hostname-rewrites&repository-name=hostname-rewrites
demoUrl: https://custom-domain-1.com
relatedTemplates:
  - edge-rewrites-upstash
---

# Hostname Rewrites

> If you're building a Platforms on Vercel, this example is for you.

In this example, you'll learn how to programmatically create unique content pages for your users with a multi-tenant infrastructure using Edge Middleware. Each user gets assigned a unique subdomain when they create their account, with the (usually paid) option to add a custom domain.

For context, here are some example pages:

- [subdomain-1.vercel.sh](https://subdomain-1.vercel.sh/) (subdomain)
- [subdomain-2.vercel.sh](https://subdomain-2.vercel.sh/) (subdomain)
- [subdomain-3.vercel.sh](https://subdomain-3.vercel.sh/) (subdomain)
- [custom-domain-1.com](https://custom-domain-1.com/) (custom domain, maps to [subdomain-1.vercel.sh](https://subdomain-1.vercel.sh/))

All of these generated sites are powered by ISR (no SSR at all) so they load pretty much instantly + the inter-page transitions are lightning fast.

The example above is generated based on the following mock database:

```
const mockDB = [
    {name: "Site 1", description: "Subdomain + custom domain", subdomain: "subdomain-1", customDomain: "custom-domain-1.com"},
    {name: "Site 2", description: "Subdomain only", subdomain: "subdomain-2", customDomain: null},
    {name: "Site 3", description: "Subdomain only", subdomain: "subdomain-3", customDomain: null},
]
```

When deploying your own clone of this example, you will need to replace the data fetching methods in `getStaticPaths` and `getStaticProps` with your own database of choice (BYOD, _Bring-Your-Own-Database_).

To give a bit of context of how this can be applied in a real-world context, we recently launched the [Platforms Starter Kit](https://vercel.com/templates/next.js/platforms-starter-kit) – a comprehensive template for site builders, multi-tenant platforms, and low-code tools:

- [demo.vercel.pub](https://demo.vercel.pub)
- [platformize.co](https://platformize.co) (custom domain that maps to [demo.vercel.pub](https://demo.vercel.pub))
- [app.vercel.pub](https://app.vercel.pub) (editing backend)

For more info on the Platforms Starter Kit:

- [Twitter Announcement](https://twitter.com/vercel/status/1484237805941403655)
- [Github Repo](https://github.com/vercel/platforms)
- [Official Guide](https://vercel.com/guides/nextjs-multi-tenant-application)

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/hostname-rewrites&project-name=hostname-rewrites&repository-name=hostname-rewrites)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/edge-middleware/hostname-rewrites hostname-rewrites
```

[`.env`](.env) has the following defaults:

```bash
ROOT_DOMAIN=vercel.app
DEFAULT_DEV_HOST=subdomain-1
```

Feel free to change `ROOT_DOMAIN` to your domain if your hostnames are not under `.vercel.app`. `DEFAULT_DEV_HOST` is the default hostname for development in localhost.

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).

> 💡 Do note that you will need to replace the `ROOT_DOMAIN` variable in `.env.local` with your domain of choice and add that domain as a wildcard domain to your Vercel project.
