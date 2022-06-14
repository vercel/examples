# Raw Body in Serverless Functions

You can use Vercel Serverless Functions to recieve webhooks from third-party services like Stripe. Certain providers require access to the raw body inside the function to validate the signature from the request.

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/examples/tree/main/edge-functions/raw-body-functions&project-name=raw-body-functions&repository-name=raw-body-functions)

### Running Locally

Install the Vercel CLI:

```bash
npm i -g vercel
```

Then run the example at the root of the repository:

```bash
vercel dev
```

You can test the function using `cURL`:

```bash
curl -X POST -H "Content-Type: text/plain" --data "This is raw data" http://localhost:3000/api/webhoook
```
