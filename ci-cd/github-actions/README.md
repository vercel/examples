---
name: Github Actions Deploy
slug: github-actions-deploy
description: Learn how to use the Vercel CLI and Github actions to deploy to Vercel with your own CICD
framework: Next.js
---

# Bring Your Own CI/CD - Github Actions

This example shows how to use the Vercel CLI and Github Actions to deploy to Vercel with your own custom pipeline. You can generate preview deployments, deploy to roduction when code is merged into the main branch, and enable rollbacks by reverting PRs. This is useful for both users of Github.com who want more CI/CD control as well as Github Enterprise Server users who can't leverge the built-in integration.

## Demo

https://github-actions.vercel.app

## How to Use

### Clone

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/examples/tree/main/ci-cd/github-actions
# or
yarn create next-app --example https://github.com/vercel/examples/tree/main/cd-cd/github-actions
```

Next, run Next.js in development mode:

```bash
npm install
npm run dev

# or

yarn
yarn dev
```

You will notice there are two example pipelines for a trunk-based development workflow in the `.github/workflows` folder. One is for preview and and one is for production deployments:

```yaml
name: GitHub Actions Vercel Preview Deployment
env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
on:
  push:
    branches-ignore:
      - main
jobs:
  Deploy-Preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install Vercel CLI
        run: npm install --global vercel@canary
      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}
      - name: Build Project Artifacts
        run: vercel build --token=${{ secrets.VERCEL_TOKEN }}
      - name: Deploy Project Artifacts to Vercel
        run: vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }}
```

You will see that we need to setup three secrets (VERCEL_ORG_ID, VERCEL_PROJECT_ID, VERCEL_TOKEN) in this action, these will be covered in the next section.

### Deploy

To finish configuration we now need to configure our Vercel project and link it to our Github Actions.

First, you need to install the Vercel CLI locally with `npm install --global vercel` and login to your account with `vercel login`.

Once you are logged in you can create a new project for your application in Vercel with `vercel link`.

This will create a `.vercel` folder in your project where you will find a `project.json` file with both your `"projectId"` and `"orgId"`. Note these for later because we will need them to link from Github.

Finally make sure you have created a [Vercel API token](https://vercel.com/support/articles/how-do-i-use-a-vercel-api-access-token) to give Github the right authentication to push to your Vercel account.

Now go to your Github repository and add as [secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets) the `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` and `VERCEL_TOKEN` we created previously.

This finishes off all the configuration neccesary and now you can try out the workflow:

- Create a new PR in Github
- Github Actions will use the Vercel CLI in the Pipeline to build your application.
- The Pipeline uploads the build output to Github
- When the pull request is merged, a Production build is created and deployed
