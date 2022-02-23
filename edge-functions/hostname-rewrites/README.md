# Hostname Rewrites Example

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

To give a bit of context of how this can be applied in a real-world context, we recently launched the [Platforms Starter Kit](https://demo.vercel.pub/platforms-starter-kit) – a comprehensive template for site builders, multi-tenant platforms, and low-code tools:

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

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/examples/tree/main/edge-functions/hostname-rewrites&env=ROOT_URL&project-name=hostname-rewrites&repository-name=hostname-rewrites)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/edge-functions/hostname-rewrites hostname-rewrites
# or
yarn create next-app --example https://github.com/vercel/examples/tree/main/edge-functions/hostname-rewrites hostname-rewrites
```

You'll need to set the root , a wildcard domain in your Vercel project, as an environment variable. Copy the `.env.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.example .env.local
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

> 💡 Do note that you will need to replace the `ROOT_URL` variable in the `.env.example` file with your domain of choice and add that domain as a wildcard domain your Vercel project.
