# DataDome

[DataDome](https://datadome.co/) can provide real-time bot protection, ip blocking, custom rules protection and other security protections to any website.

This demo shows features:

- IP Blocking
- Protection through Custom Rules

## Demo

https://edge-datadome.vercel.app/

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel-customer-feedback%2Fedge-middleware%2Ftree%2Fmain%2Fexamples%2Fdatadome&env=NEXT_PUBLIC_DATADOME_CLIENT_KEY,DATADOME_SERVER_KEY,DATADOME_MANAGEMENT_KEY&project-name=datadome&repo-name=datadome)

## Getting Started

You'll need to have an account with [DataDome](https://datadome.co/free-signup/). Once that's done, copy the `.env.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.example .env.local
```

Then open `.env.local` and set the environment variables to match the ones in your DataDome dashboard. Your keys should be available at https://app.datadome.co/dashboard/config/protection/keys

Next, run Next.js in development mode:

```bash
npm install
npm run dev

# or

yarn
yarn dev
```
