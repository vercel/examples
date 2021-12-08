# Feature Flags Optimizely

[Optimizely](https://www.optimizely.com/company/) provides a leading digital experience platform (DXP), that empowers teams with the tools and insights they need to create and optimize in new and novel ways. With Optimizely, you can operate with data-driven confidence to create hyper-personalized experiences. Our content, commerce, intelligence and experimentation capabilities make even the most complex scenarios simple. Optimizely has more than 900 partners around the globe.

In this example, you will be able to use optimizely feature flags at the edge with [NextJS](https://nextjs.org/) applications deployed on [Vercel](https://vercel.com/).

## Get a free account
You need an account to follow this example. If you do not have an account, you can [register for a free account](https://www.optimizely.com/campaigns/feature-detail-pages/free-feature-flagging/). If you already have an account navigate to your Flags-enabled project.

## Get your SDK Key
To find your SDK Key in your Optimizely project:
1. Go to **Settings > Primary Environment**
2. Copy and save the **SDK Key** for your primary environment. **Note:** Each environment has its own SDK key.
  ![Copy SDK Key](https://files.readme.io/e392205-sdk_key.png)

## Create the feature flag
A feature flag lets you control the users that are exposed to a new feature code in your app. For this quickstart, imagine that you are rolling out a redesigned sorting feature for displaying products.

Create a flag in Optimizely named **product_sort** and give it a variable named **sort_method**:

1. Go to **Flags > Create Flag**.
2. Name the flag key *product_sort* and click **Create Flag**, which corresponds to the flag key in your sample app.
3. Go to **Default Variables** and click **New (+)**.
4. Set the variable type to "String".
5. Name the variable *sort_method*, which corresponds to the variable key in your sample app.
6. Set the variable default value to alphabetical, which represents your old sorting method.
  ![variable sort method](https://files.readme.io/5367828-variable_sort_method.png)
7. Click **Save** at the lower right corner to save the variable.
8. Go to **Variations** and click the default "on" variation. A variation is a wrapper for a collection of variable values.
9. Set the **sort_method** variable value to *popular_first*, which represents your new sorting method.
  ![variation popular](https://files.readme.io/7c41848-variation_popular.png)
10. Click **Save**.

## Create the flag delivery rule
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
