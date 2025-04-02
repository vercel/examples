---
name: Gitlab CI/CD Deploy
slug: gitlab-cicd-deploy
description: Deploy to Vercel with your custom Gitlab CI/CD.
---

# Bring Your Own CI/CD - Gitlab CI/CD

You can use Vercel with Gitlab as your CI/CD provider to generate Preview Deployments for every `git` push and deploy to Production when code is merged into the `main` branch.

This approach is useful for developers who want full control over their CI/CD pipeline, as well as Gitlab Self-Managed users, who can’t leverage Vercel’s [zero-configuration git integration](https://vercel.com/docs/concepts/git/vercel-for-gitlab) currently.

## Building Your Application

You can build your application locally (or in a Pipeline) without giving Vercel access to the source code through `vercel build`. Vercel automatically detects your frontend framework and generates a `.vercel/output` folder conforming to the [Build Output API specification](https://vercel.com/blog/build-output-api).

`vercel build` allows you to build your project within your own CI setup, whether it be Gitlab CI/CD or your own in-house CI, and upload _only_ those build artifacts (and not the source code) to Vercel to create a deployment.

## Configuring Gitlab CI/CD for Vercel

`vercel deploy --prebuilt` skips the build step on Vercel and uploads the previously generated `.vercel/output` folder from the CI/CD Pipeline.

Let’s create our CI/CD Pipeline by creating a new file `.gitlab-ci.yml`:

```yaml
default:
  image: node:16.16.0

stages:
  - deploy

deploy_preview:
  stage: deploy
  except:
    - main
  variables:
    TOKEN: $VERCEL_TOKEN
    VERCEL_PROJECT_ID: $VERCEL_PROJECT_ID_X
    VERCEL_ORG_ID: $VERCEL_ORG_ID_X
  script:
    - npm install --global vercel
    - vercel pull --yes --environment=preview --token="$TOKEN"
    - vercel build --token="$TOKEN"
    - vercel deploy --prebuilt --token="$TOKEN"

deploy_production:
  stage: deploy
  only:
    - main
  variables:
    TOKEN: $VERCEL_TOKEN
    VERCEL_PROJECT_ID: $VERCEL_PROJECT_ID_X
    VERCEL_ORG_ID: $VERCEL_ORG_ID_X
  script:
    - npm install --global vercel
    - vercel pull --yes --environment=production --token="$TOKEN"
    - vercel build --prod --token="$TOKEN"
    - vercel deploy --prebuilt --prod --token="$TOKEN"
```

> 💡 **Note:** GitLab does not expand CI/CD variables defined in the UI when reused with the *same name* in `.gitlab-ci.yml`.  
> To avoid this, assign different names in GitLab UI like `VERCEL_ORG_ID_X` and `VERCEL_PROJECT_ID_X`, and map them inside your pipeline.  
> See [GitLab docs](https://docs.gitlab.com/ci/variables/#in-service-containers) for more details.

This pipeline has two triggers:

- One that creates preview environments on commits pushed to a git branch
- Another that creates production environments on commits to the `main` branch

Finally, let’s add the required values from Vercel as CI/CD variables in Gitlab:

1. Retrieve your [Vercel Access Token](https://vercel.com/support/articles/how-do-i-use-a-vercel-api-access-token)
2. Install the [Vercel CLI](https://vercel.com/cli) and run `vercel login`
3. Inside your folder, run `vercel link` to create a new Vercel project
4. Inside the generated `.vercel` folder, save the `projectId` and `orgId` from the `project.json`
5. Inside Gitlab, add `VERCEL_TOKEN`, `VERCEL_PROJECT_ID_X`, and `VERCEL_ORG_ID_X` as [CI/CD variables](https://docs.gitlab.com/ee/ci/variables/).

## Deploying Your Vercel Application with Gitlab CI/CD

Now that your Vercel application is configured with Gitlab CI/CD, you can try out the workflow:

- Create a new merge request to your Gitlab repository
- Gitlab CI/CD will recognize the change and use the Vercel CLI to build your application
- The pipeline uploads the build output to Vercel and creates a Preview Deployment
- When the merge request is merged, a Production build is created and deployed

Every merge request will now automatically have a Preview Deployment attached. If the merge request needs to be rolled back, you can revert and merge the MR and Vercel will start a new Production build back to the old git state.
