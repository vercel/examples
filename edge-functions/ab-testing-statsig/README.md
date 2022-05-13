# A/B testing with Statsig

This example shows how to do A/B testing using statsig

## Demo

https://edge-ab-testing-statsig.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/examples/tree/main/edge-functions/ab-testing-statsig&project-name=ab-testing-statsig&repository-name=ab-testing-statsig&env=STATSIG_SERVER_API_KEY,NEXT_PUBLIC_STATSIG_CLIENT_KEY&envDescription=API%20keys%20used%20by%20statsig%20on%20the%20server%20and%20the%20client&envLink=https%3A%2F%2Fdocs.statsig.com%2F%23account-sign-up-and-api-key)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/edge-functions/ab-testing-statsig
# or
yarn create next-app --example https://github.com/vercel/examples/tree/main/edge-functions/ab-testing-statsig
```

Set your environment variables.

1. Log in to the [Statsig console](https://console.statsig.com/) and navigate to
   - Settings
   - API KEYS
2. Copy your Client API keys and paste it in [.env.example](./env.example)
3. Rename `.env.example` to `.env.local`

Next, run Next.js in development mode:

```bash
npm install
npm run dev

# or

yarn
yarn dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
