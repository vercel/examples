# Hostname Rewrites Example

In this example, you'll learn how to programmatically create unique content pages for your users with a multi-tenant infrastructure using Edge Middleware. Each user gets assigned a unique subdomain when they create their account, with the (usually paid) option to add a custom domain.

For context, here are some example pages:  
- https://test-site-1.vercel.sh/ (subdomain)
- https://test-site-2.vercel.sh/ (subdomain)
- https://test-site-3.vercel.sh/ (subdomain)
- https://test-site-vercel.com/ (custom domain)

All of these generated sites are powered by ISR (no SSR at all) so they load pretty much instantly + the inter-page transitions are lightning fast. The app.platformize.co itself is static + SWR, which provides a great client-side transition UX.

The example above is generated based on the following mock database:

```
const mockDB = [
    {name: "Test Site", subdomain: "test-site-1", customDomain: "test-site-vercel.com"},
    {name: "Test Site 2", subdomain: "test-site-2", customDomain: null},
    {name: "Test Site 3", subdomain: "test-site-3", customDomain: null},
]
```

## Deploy your own

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel-customer-feedback/edge-middleware/tree/main/examples/hostname-rewrites&project-name=platforms&repository-name=platforms)



## How to use

Download this repository via git:

```bash
git clone https://github.com/vercel-customer-feedback/edge-middleware.git
```

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example edge-middleware/examples/hostname-rewrites hostname-rewrites
# or
yarn create next-app --example edge-middleware/examples/hostname-rewrites hostname-rewrites
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).

