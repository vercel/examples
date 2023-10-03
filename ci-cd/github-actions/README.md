---
name: Github Actions Deploy
slug: github-actions-deploy
description: Deploy to Vercel with your custom GitHub Actions CI/CD.
---

# Bring Your Own CI/CD - GitHub Actions

You can use Vercel with GitHub Actions as your CI/CD provider to generate Preview Deployments for every `git` push and deploy to Production when code is merged into the `main` branch.

This approach is useful for developers who want full control over their CI/CD pipeline, as well as GitHub Enterprise Server users, who can’t leverage Vercel’s [zero-configuration git integration](https://vercel.com/docs/concepts/git/vercel-for-github) currently.

## Building Your Application

You can build your application locally (or in an Action) without giving Vercel access to the source code through `vercel build`. Vercel automatically detects your frontend framework and generates a `.vercel/output` folder conforming to the [Build Output API specification](https://vercel.com/blog/build-output-api).

`vercel build` allows you to build your project within your own CI setup, whether it be GitHub Actions or your own in-house CI, and upload _only_ those build artifacts (and not the source code) to Vercel to create a deployment.

## Configuring GitHub Actions for Vercel

`vercel deploy --prebuilt` skips the build step on Vercel and uploads the previously generated `.vercel/output` folder from the GitHub Action.

Let’s create our Action by creating a new file `.github/workflows/preview.yaml`:

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
      - uses: actions/checkout@v3
      - name: Install Vercel CLI
        run: npm install --global vercel@canary
      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}
      - name: Build Project Artifacts
        run: vercel build --token=${{ secrets.VERCEL_TOKEN }}
      - name: Deploy Project Artifacts to Vercel
        run: vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }}
```

This action will run when your code is pushed to a git branch. Let’s do the same for Production environments with a separate Action:

```yaml
name: GitHub Actions Vercel Production Deployment
env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
on:
  push:
    branches:
      - main
jobs:
  Deploy-Production:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install Vercel CLI
        run: npm install --global vercel@canary
      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      - name: Build Project Artifacts
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
      - name: Deploy Project Artifacts to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

Finally, let’s add the required values from Vercel as secrets in GitHub:

1. Retrieve your [Vercel Access Token](https://vercel.com/support/articles/how-do-i-use-a-vercel-api-access-token)
2. Install the [Vercel CLI](https://vercel.com/cli) and run `vercel login`
3. Inside your folder, run `vercel link` to create a new Vercel project
4. Inside the generated `.vercel` folder, save the `projectId` and `orgId` from the `project.json`
5. Inside GitHub, add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` as [secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets).

## Deploying Your Vercel Application with GitHub Actions

Now that your Vercel application is configured with GitHub Actions, you can try out the workflow:

- Create a new pull request to your GitHub repository
- GitHub Actions will recognize the change and use the Vercel CLI to build your application
- The Action uploads the build output to Vercel and creates a Preview Deployment
- When the pull request is merged, a Production build is created and deployed

Every pull request will now automatically have a Preview Deployment attached. If the pull request needs to be rolled back, you can revert and merge the PR and Vercel will start a new Production build back to the old git state.
