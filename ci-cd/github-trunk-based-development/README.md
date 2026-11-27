---
name: GitHub Actions for Trunk Based Development
slug: github-trunk-based-development
description: Follow a Trunk Based Development workflow with Vercel CI/CD and GitHub Actions for Production testing and release
---

# Maintain Maximum Flexibility and Platform Features with Vercel CI/CD and GitHub Actions

Use Github Actions to consume the output of Vercel's CI/CD process to run e2e testing, additional checks, and release while also maintaining access to Vercel's built-in CI/CD features like Promote to Production, Checks, Instant Rollbacks, and the Vercel GitHub bot.

This approach is useful for teams that follow a Trunk Based Development workflow that wish to test directly on a production environment and not a separate staging environment. The CI/CD configuration in this example is similar to a blue-green deployment where e2e tests execute on a Production deployment URL not used for end users. When all tests pass the public domain is aliased to the deployment URL that is then available to end users.

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
      - name: Placeholder for running e2e tests via Github Actions (Cypress, Playwright, etc)
        run: sleep 30
  release:
    needs: e2e
    runs-on: ubuntu-latest
    steps:
      - name: Install Vercel CLI
        run: npm install --global vercel@latest
      - name: Alias Production URL
        run: vercel alias --token=${{ secrets.VERCEL_TOKEN }} set $VERCEL_URL ${{ vars.PRODUCTION_URL }}
```

This action:

1. Runs on the `deployment_status` change. This lets Vercel run its default CI/CD process and features.
2. Will only run when the environment is `Production` and the `github.event.deployment_status.state` is successful.
3. Runs an `e2e` job with any testing framework the developer chooses (we are using a placeholder command in this example).
4. Runs a `release` job upon a successful completion of the `e2e` job.
5. The `release` job uses the Vercel CLI's `alias` command to alias the production URL to the deployment URL (stored in the `$VERCEL_URL` [Vercel System Environment Variable](https://vercel.com/docs/concepts/projects/environment-variables#system-environment-variables)). Note that on a production project the production URL should be set to a Custom Domain in Vercel's [Domains Dashboard](https://vercel.com/dashboard/domains).

Set the required settings in Vercel and GitHub:

1. [Add a custom domain on Vercel](https://vercel.com/docs/concepts/projects/domains/add-a-domain). Do not add the domain under the Project Settings Domains. Doing so will require assigning a branch and deployments will assign that URL prior to the `alias` step and that is not desired for this workflow.
2. Retrieve a [Vercel Access Token](https://vercel.com/support/articles/how-do-i-use-a-vercel-api-access-token)
3. In GitHub, add `VERCEL_TOKEN` as a [secret](https://docs.github.com/en/actions/security-guides/encrypted-secrets).
4. In GitHub, add `PRODUCTION_URL` as a [variable](https://docs.github.com/en/actions/learn-github-actions/variables).
5. Replace the placeholder (or leave for demo purposes) `sleep 30` in the `e2e` workflow job with the test script of your choosing.

# Deploying a Change to Production

Once the above settings are configured, test this workflow by making a change:

1. Create a new pull request in the GitHub repository.
2. Vercel will create a new build and subsequent Preview Deployment for the Pull Request (skipping the custom action workflow since it is not a Production release).
3. Upon the successful deployment the changes will be visible on a preview URL for review.
4. Approve and merge the open Pull Request into `main`.
5. Vercel will create a new production build and production deployment for the merge into `main`. Note that upon the Vercel deployment completing the changes will be visible on the `[project].vercel.app` domain (the default URL assigned to the project) which is **not** the custom domain configured (which will be done in step 7).
6. The GitHub Action will run, starting with any configured e2e tests on the non-production domain (i.e. the `[project].vercel.app` domain).
7. Upon successful completion of the e2e testing job the release job will run and alias the custom domain to the deployment domain and the change will be live on the production URL for end users.

## Continue Using Vercel Build and Deployment Features

Since the Vercel CI/CD process is still utilized teams can continue to leverage [Instant Rollback](https://vercel.com/docs/concepts/deployments/instant-rollback), [Promote to Production](https://vercel.com/docs/concepts/deployments/instant-rollback#instant-rollback-vs.-promote-to-production), [Checks](https://vercel.com/docs/integrations/checks-overview), and the Vercel GitHub bot integration.

# Demo

https://user-images.githubusercontent.com/6125972/216469924-2f64943f-ed06-4fe4-a941-b85bb4ca803c.mp4
