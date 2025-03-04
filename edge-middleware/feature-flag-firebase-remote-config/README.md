---
name: A/B Testing with Firebase remote config
slug: ab-testing-firebase-remote-config
description: Firebase remote config is a Google cloud service that used to run A/B Testing and random percentage targeting with Google Analytics to A/B test improvements to your app across different segments of your user base to validate improvements before rolling them out to your entire user base.
framework: Next.js
useCase: Edge Middleware
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/feature-flag-firebase-remote-config&env=PRIVATE_KEY_ID,PRIVATE_KEY,CLIENT_EMAIL,CLIENT_ID,AUTH_URI,TOKEN_URI,AUTH_PROVIDER_X509_CERT_URL,CLIENT_X509_CERT_URL&project-name=feature-flag-firebase-remote-config&repository-name=feature-flag-firebase-remote-config
demoUrl: https://feature-flag-firebase-remote-config.vercel.app
relatedTemplates:
  - ab-testing-simple
---

# A/B Testing with Firebase remote config

[Firebase remote config](https://firebase.google.com/docs/remote-config) is a Google cloud service that used to run A/B Testing and random percentage targeting with Google Analytics to A/B test improvements to your app across different segments of your user base to validate improvements before rolling them out to your entire user base.

## Demo

https://feature-flag-firebase-remote-config.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/feature-flag-firebase-remote-config&env=PRIVATE_KEY_ID,PRIVATE_KEY,CLIENT_EMAIL,CLIENT_ID,AUTH_URI,TOKEN_URI,AUTH_PROVIDER_X509_CERT_URL,CLIENT_X509_CERT_URL&project-name=feature-flag-firebase-remote-config&repository-name=feature-flag-firebase-remote-config)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/edge-middleware/feature-flag-firebase-remote-config feature-flag-firebase-remote-config
# or
yarn create next-app --example https://github.com/vercel/examples/tree/main/edge-middleware/feature-flag-firebase-remote-config feature-flag-firebase-remote-config
```

You'll need to have an account with [Firebase](https://firebase.google.com) and start an project with [Firebase remote config](https://firebase.google.com/docs/remote-config). You will be asked to setup your first remote config and a few conditions. After setup, at the Firebase remote config console, go to **Project Overview** > **Project Settings** > **Service accounts tab** and click the button **Generate new private key**. It will prompt a download of a JSON file with your service account variables. Once that's done, copy the `.env.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.example .env.local
```

Then open `.env.local` and set the environment variables to match the ones in the JSON file you have downloaded just now.

Next, run Next.js in development mode:

```bash
yarn dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
