# A/B Testing with Google Optimize

[Google Optimize](https://marketingplatform.google.com/about/optimize/) is Google' optimization tool and A/B testing solution, natively integrated with Google Analytics. In this example we'll do A/B testing with Optimize experiments at the edge.

By A/B testing directly on the server-side, you'll reduce layout shift from client-loaded experiments and improving your site's performance with smaller JavaScript bundles.

## Demo

https://edge-functions-ab-testing-google-optimize.vercel.sh

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-functions/ab-testing-google-optimize&project-name=ab-testing-google-optimize&repo-name=ab-testing-google-optimize)

## Getting Started

[`pages/_middleware.ts`](pages/_middleware.ts) loads the experiments using a pre-defined JSON file ([lib/optimize-experiments.json](lib/optimize-experiments.json)), it currently has to be edited manually in order to add the experiments created in https://optimize.google.com.

Run Next.js in development mode:

```bash
npm install
npm run dev

# or

yarn
yarn dev
```

Once the page loads (http://localhost:3000) the layout will load the `optimize.js` script using your google tracking id, and the pages will register events for the current experiment and variant.

To create your own experiments you'll need an account with [Google Optimize](https://optimize.google.com/optimize/home). Once that's done, copy the `.env.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.example .env.local
```

Then open `.env.local` and set the environment variables to match the ones for your Google Optimize account.
