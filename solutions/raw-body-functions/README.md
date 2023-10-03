# Raw Body in Serverless Functions

You can use Vercel Serverless Functions to receive webhooks from third-party services like Stripe. Certain providers require access to the raw body inside the function to validate the signature from the request.

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/examples/tree/main/solutions/raw-body-functions&project-name=raw-body-functions&repository-name=raw-body-functions)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/solutions/raw-body-functions raw-body-functions
# or
yarn create next-app --example https://github.com/vercel/examples/tree/main/solutions/raw-body-functions raw-body-functions
```

Install the Vercel CLI:

```bash
npm i -g vercel
```

Then run the app at the root of the repository:

```bash
vercel dev
```

You can test the function using `cURL`:

```bash
curl -X POST -H "Content-Type: text/plain" --data "This is raw data" http://localhost:3000/api/webhoook
```
