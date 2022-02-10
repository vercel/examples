# Optimizely Full Stack Feature Flags and Experimentation

[Optimizely Full Stack](https://docs.developers.optimizely.com/full-stack/docs) is a feature flagging and experimentation platform for websites, mobile apps, chatbots, APIs, smart devices, and anything else with a network connection.

You can deploy code behind feature flags, experiment with A/B tests, and roll out or roll back features immediately. All of this functionality is available with minimal performance impact via easy-to-use, open source SDKs.

In this example, you will be able to use optimizely feature flags at the edge with [NextJS](https://nextjs.org/) applications deployed on [Vercel](https://vercel.com/).

## One-Click Deploy

**Note:** Before clicking `Deploy`, Please follow the section [Set up Optimizely](#set-up-optimizely) to create an account, set up feature flags and obtain the Optimizely *SDK Key*.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/optimizely/vercel-examples/tree/main/edge-functions/feature-flag-optimizely&env=OPTIMIZELY_SDK_KEY&project-name=feature-flag-optimizely&repository-name=feature-flag-optimizely)

## Run Locally

**Note:** Before running locally, Please follow the section [Set up Optimizely](#set-up-optimizely) to create an account, set up feature flags and obtain the Optimizely *SDK Key*.

1. generate the Next JS app using this example
    ```
    npx create-next-app --example https://github.com/optimizely/vercel-examples/tree/main/edge-functions/feature-flag-optimizely feature-flag-optimizely
    ```
    or    
    ```
    yarn create-next-app --example https://github.com/optimizely/vercel-examples/tree/main/edge-functions/feature-flag-optimizely feature-flag-optimizely
    ```

2. create a local environment file from example and add your optimizely *SDK Key*.
    ```
    cp .env.example .env.local
    ```

3. Run locally
    ```
    npm run dev
    ```
    or
    ```
    yarn dev
    ```

## Auto update with Optimizely Webhooks

This example fetches the latest datafile from the optimizely CDN during every build. [Deploy Hooks](https://vercel.com/docs/concepts/git/deploy-hooks) from Vercel can be used with [Optimizely Webhooks](https://docs.developers.optimizely.com/full-stack/docs/configure-webhooks#section-2-create-a-webhook-in-optimizely) to keep the application up to date with the latest changes in the optimizely project.

### Create a Deploy Hook in Vercel

1. Navigate to **Settings** tab in your vercel deployment.
2. Look for the **Deploy Hooks** section and create a **Hook**.
3. This will generate a url that can be used to trigger a rebuild of the deployment.

### Create a Webhook in Optimizely

1. Follow the instructions [here](https://docs.developers.optimizely.com/full-stack/docs/configure-webhooks#section-2-create-a-webhook-in-optimizely) to create a Webhook in your optimizely project.
2. Use the `Deploy Hook` Url Generated from the previous section to create the Optimizely Webhook.

### How it works
When a user will make any change to the Optimizely Project using the UI, the Webhook will hit vercel's `Deploy Hook` Url. This will trigger a new build on Vercel. Every new build fetches the latest version of the Optimizely datafile and uses it in the application.

## Set up Optimizely

### Get a free account
You need an account to follow this example. If you do not have an account, you can [register for a free account](https://www.optimizely.com/campaigns/feature-detail-pages/free-feature-flagging/). If you already have an account navigate to your Flags-enabled project.

### Get your SDK Key
To find your SDK Key in your Optimizely project:
1. Go to **Settings > Primary Environment**
2. Copy and save the **SDK Key** for your primary environment. **Note:** Each environment has its own SDK key.
  ![Copy SDK Key](https://files.readme.io/e392205-sdk_key.png)

### Create the feature flag
A feature flag lets you control the users that are exposed to a new feature code in your app. For this example, imagine that you are rolling out a redesigned sorting feature for displaying products.

Create a flag in Optimizely named **product_sort** and give it a variable named **sort_method**:

1. Go to **Flags > Create Flag**.
2. Name the flag key *product_sort* and click **Create Flag**, which corresponds to the flag key in this example.
3. Go to **Default Variables** and click **New (+)**.
4. Set the variable type to "String".
5. Name the variable *sort_method*, which corresponds to the variable key in this example.
6. Set the variable default value to alphabetical, which represents your old sorting method.
  ![variable sort method](https://files.readme.io/5367828-variable_sort_method.png)
7. Click **Save** at the lower right corner to save the variable.
8. Go to **Variations** and click the default "on" variation. A variation is a wrapper for a collection of variable values.
9. Set the **sort_method** variable value to *popular_first*, which represents your new sorting method.
  ![variation popular](https://files.readme.io/7c41848-variation_popular.png)
10. Click **Save**.

### Create the flag delivery rule
Make a targeted delivery rule for the "on" variation for the *product_sort* flag. A targeted delivery lets you gradually release a feature flag to users, but with the flexibility to roll it back if you encounter bugs.

1. Verify that you are in your primary environment (since you are using the primary environment SDK key):
  ![verify environment](https://files.readme.io/69332d4-verify_env.png)
2. Click *Add Rule* and select *Targeted Delivery*.
3. Set the traffic slider to 50%. This delivers the flag to 50% of everyone who triggers the flag in this environment. You can roll out or roll back the **product_sort** flag to a percentage of traffic whenever you want.
4. From the **Deliver** drop-down, select **On**.
5. Click **Save**.
  ![deliver on](https://files.readme.io/8ead3e6-Screenshot_docs.png)

6. Enable the flag for your flag rule:
  ![enable flag](https://files.readme.io/cea7b99-enable_flag.png)
