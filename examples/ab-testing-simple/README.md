# A/B Testing Example

By A/B testing directly on the server-side, you'll reduce layout shift from client-loaded experiments and improving your site's performance with smaller JavaScript bundles.

For example, open this URL in your browser normally and also in an incognito window.

- https://edge-middleware-demo.vercel.sh/home

![A/B Testing](/examples/ab-testing-simple/public/ab-testing-simple-demo.png)

Since the different variants are generated statically on the server side, it mitigates any potential layout shift that could happen when a variant modal is inserted into the DOM on client side, hence improving your site's performance.

The magic happens in the [`_middleware.ts` file](/examples/ab-testing-simple/pages/home/_middleware.ts):

```javascript
import type { EdgeRequest, EdgeResponse } from 'next'

export default function (req: EdgeRequest, res: EdgeResponse) {
  // check if there is a cookie called "bucket"
  let bucket = req.cookies.bucket

  // if the "bucket" cookie doesn't exist
  if (!bucket) {
    // randomly assign values "a" or "b" to the bucket variable
    bucket = Math.random() >= 0.5 ? 'a' : 'b'

    // set "bucket" cookie to the bucket variable
    res.cookie('bucket', bucket)
  }

  // rewrite content according to the value of the bucket variable
  res.rewrite(`/home/${bucket}`)
}
```

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel-customer-feedback/edge-functions/tree/main/examples/ab-testing-simple&project-name=ab-testing-simple&repository-name=ab-testing-simple)

### Clone and Deploy

Download this repository via git:

```bash
git clone https://github.com/vercel-customer-feedback/edge-functions.git
```

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example edge-middleware/examples/ab-testing-simple ab-testing-simple
# or
yarn create next-app --example edge-middleware/examples/ab-testing-simple ab-testing-simple
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
