---
name: GitHub Actions with Vercel CI/CD
slug: github-actions-with-vercel-cicd
description: Follow a Trunk Based Development workflow with Vercel CI/CD and GitHub Actions for Production testing and release
---

# Maintain Maximum Flexibility and Platform Features with Vercel CI/CD and GitHub Actions

Use Github Actions to consume the output of Vercel's CI/CD process to run e2e testing, additional checks, and release while also maintaining access to Vercel's built-in CI/CD features like Promote to Production, Checks, and Instant Rollbacks.

This approach is useful for developers and teams that intend on leveraging all of Vercel's features but wish to run additional logic prior to production releases.

# Configuring GitHub Actions for Vercel

In this example there is an action defined at `.github/workflows/e2e-release-production.yaml`:

```yaml
name: E2E-Release-Production
on: [deployment_status]
jobs:
  e2e:
    if: github.event.deployment.environment == 'Production' && github.event_name == 'deployment_status' && github.event.deployment_status.state == 'success'
    runs-on: ubuntu-latest
    steps:
      - name: Placeholder for running e2e tests via GitHub Actions (Cypress, Playwright, etc)
        run: sleep 30
  release:
    needs: e2e
    runs-on: ubuntu-latest
    steps:
      - name: Install Vercel CLI
        run: npm install --global vercel@latest
      - name: Alias Production URL
        run: vercel alias --token=${{ secrets.VERCEL_TOKEN }} set $VERCEL_URL https://github-actions-with-vercel-cicd-production.vercel.app
```

This action:

1. Runs on the `deployment_status` change. This lets Vercel run its default CI/CD process and features.
2. Will only run when the environment is `Production` and the `github.event.deployment_status.state` is successful.
3. Runs an `e2e` job with any testing framework the developer chooses (we are using a placeholder command in this example).
4. Runs a `release` job upon a successful completion of the `e2e` job.
5. The `release` job uses the Vercel CLI's `alias` command to alias the production URL (`https://github-actions-with-vercel-cicd-production.vercel.app/`) to the deployment URL (stored in the `$VERCEL_URL` environment variable). Note that on a production project the production URL should be set to a Custom Domain in Vercel's [Domains Dashboard](https://vercel.com/dashboard/domains). This example is using a `.vercel.app` domain for example purposes.

Set the required settings in Vercel and GitHub:

1. If not added already, [add a custom domain on Vercel](https://vercel.com/docs/concepts/projects/domains/add-a-domain)
2. Retrieve a [Vercel Access Token](https://vercel.com/support/articles/how-do-i-use-a-vercel-api-access-token)
3. In GitHub, add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` as [secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets).
4. Replace the placeholder (or leave for demo purposes) `sleep 30` in the `e2e` workflow job with the test script of your choosing.

# Deploying a Change to Production

Once the above settings are configured, test this workflow by making a change:

1. Create a new pull request in the GitHub repository.
2. Vercel will create a new build and subsequent Preview Deployment for the Pull Request (skipping the custom action workflow since it is not a Production release).
3. Upon the successful deployment the changes will be visible on a preview URL for review.
4. Approve and merge the open Pull Request into `main`.
5. Vercel will create a new production build and production deployment for the merge into `main`. Note that upon the Vercel deployment completing the changes will be visible on `https://github-actions-with-vercel-cicd.vercel.app/` (the default URL assigned to the project) which is **not** the custom domain configured (which will be done in a following step).
6. The GitHub Action will run, starting with any configured e2e tests on the non-production or deployment domain (e.g. `https://github-actions-with-vercel-cicd.vercel.app/`).
7. Upon successful completion of the e2e testing job the release job will run and alias the custom domain (e.g. `https://github-actions-with-vercel-cicd-production.vercel.app/`) to the deployment domain and the change will now be live on the production URL.

## Continue Using Vercel Build and Deployment Features

Since the Vercel CI/CD process is still utilized in this example teams can continue to leverage [Instant Rollback](https://vercel.com/docs/concepts/deployments/instant-rollback), [Promote to Production](https://vercel.com/docs/concepts/deployments/instant-rollback#instant-rollback-vs.-promote-to-production), and [Checks](https://vercel.com/docs/integrations/checks-overview) as designed.