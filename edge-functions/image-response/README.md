# Image Response Example

Below is the code from pages/_middleware.ts that parses a png to a blob and returns it as the response body:
```js
import { b64toBlob } from "../lib/parse";

export default function middleware() {
  const png = "..."; // Base 64 image
  const blob = b64toBlob(png, "image/png"); // Transform it to a blob
  
  return new Response(blob); // Return it as a response
}
```

## Demo

https://edge-functions-image-response.vercel.sh

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/examples/tree/main/edge-functions/image-response&project-name=image-response&repository-name=image-response)

### Clone and Deploy

Download this repository via git:

```bash
git clone https://github.com/vercel-customer-feedback/edge-functions.git
```

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example edge-middleware/examples/image-response image-response
# or
yarn create next-app --example edge-middleware/examples/image-response image-response
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
