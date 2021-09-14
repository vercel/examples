# A/B Testing with Google Optimize

[Google Optimize](https://marketingplatform.google.com/about/optimize/) is Google' optimization tool and A/B testing solution, natively integrated with Google Analytics. In this example we'll do A/B testing with Optimize experiments at the edge.

## Demo

https://ab-testing-google-optimize.vercel.app/

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=customer-success-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel-customer-feedback%2Fedge-functions%2Ftree%2Fmain%2Fexamples%2Fgoogle-optimize&project-name=google-optimize&repo-name=google-optimize)

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
