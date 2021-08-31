# A/B Testing Example

In this example, you'll learn how conduct A/B testing directly on server-side using Edge Middleware. 

For context, here's an example of this in action (open this both in your browser and incognito):
- https://edge-middleware-demo.vercel.sh/home

![A/B Testing](/examples/ab-testing/public/ab-testing-demo.png)

Since the different variants are generated statically on the server side, it mitigates any potential layout shift that could happen when a variant modal is inserted into the DOM on client side, hence improving your site's performance.

The magic happens in the `_middleware.ts` folder:



## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel-customer-feedback/edge-middleware/tree/main/examples/ab-testing&project-name=ab-testing&repository-name=ab-testing)

### Clone and Deploy

Download this repository via git:

```bash
git clone https://github.com/vercel-customer-feedback/edge-middleware.git
```

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example edge-middleware/examples/ab-testing ab-testing
# or
yarn create next-app --example edge-middleware/examples/ab-testing ab-testing
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).

