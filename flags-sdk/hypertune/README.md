---
name: Flags SDK with Hypertune and Next.js
slug: flags-sdk-hypertune-nextjs
description: Learn to use Hypertune with the Flags SDK and Next.js.
framework: Next.js
deployUrl: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fflags-sdk%2Fhypertune&env=FLAGS_SECRET&envDescription=The+FLAGS_SECRET+will+be+used+by+the+Flags+Explorer+to+securely+overwrite+feature+flags.+Must+be+32+random+bytes%2C+base64-encoded.+Use+the+generated+value+or+set+your+own.&envLink=https%3A%2F%2Fvercel.com%2Fdocs%2Fworkflow-collaboration%2Ffeature-flags%2Fsupporting-feature-flags%23flags_secret-environment-variable&project-name=flags-sdk-hypertune&repository-name=flags-sdk-hypertune
---

# Flags SDK Template

This example uses a template adapter for feature flags with the [Flags SDK](https://flags-sdk.dev) that works with the [Flags Explorer](https://vercel.com/docs/feature-flags/flags-explorer).

## Demo

[https://flags-sdk-hypertune.vercel.app/](https://flags-sdk-hypertune.vercel.app/)

## How it works

This demo shows different combinations of two banners on the home page.
The banners are configured to show/hide each banner 50% of the time.

Once you visit the page, you can see a variation of both/one/none of the banners.
Since this example is using a stable id to identify users, you will see the same variation until you reset your id.

To test different variations, you can use the Dev Tools at the bottom to reset the stable id and reload the page.
This allows you to test different variations of the banners.

If you clone the example, you can also use the [Flags Explorer](https://vercel.com/docs/feature-flags/flags-explorer) to test different variations by creating overrides.

## Deploy this template

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fflags-sdk%2Fhypertune&env=FLAGS_SECRET&envDescription=The+FLAGS_SECRET+will+be+used+by+the+Flags+Explorer+to+securely+overwrite+feature+flags.+Must+be+32+random+bytes%2C+base64-encoded.+Use+the+generated+value+or+set+your+own.&envLink=https%3A%2F%2Fvercel.com%2Fdocs%2Fworkflow-collaboration%2Ffeature-flags%2Fsupporting-feature-flags%23flags_secret-environment-variable&project-name=flags-sdk-hypertune&repository-name=flags-sdk-hypertune)

### Step 1: Link the project

In order to use the Flags Explorer, you need to link the project on your local machine.

```bash
vercel link
```

Select the project from the list you just deployed.

### Step 2: Pull all environment variables

This allows the Flags SDK and the Flags Explorer to work correctly, by getting additional metadata.

```bash
vercel env pull
```

### Step 3: Set up Hypertune

#### Use the Schema for this example

In the Hypertune dashboard, try this example by pasting the following schema into the Schema tab:

![Hypertune Schema](https://cdn.zappy.app/c52947e955bb0dbe1ff8bb6ef36c82d7.png)

```graphql
"""
This `Context` input type is used for the `context` argument on your root field.
It contains details of the current `user` and `environment`.

You can define other custom input types with fields that are primitives, enums
or other input types.
"""
input Context {
  stableId: String!
  environment: Environment!
}

type Root {
  delay: Int!
  proceedToCheckout: ProceedToCheckout!
  freeDelivery: Boolean!
  summerSale: Boolean!
}

enum Environment {
  development
  production
  test
}

enum ProceedToCheckout {
  blue
  red
  green
}
```

#### Use the Logic for this example

You will also need to create the logic for the flags to enable the flags to return different variants.

![Hypertune Logic](https://cdn.zappy.app/4c4f45a4d402e23b1802b3d506019049.png)

Create a **Flag** for the **delay** flag, and set the **Type** to **Number**.

Create a **Test** for each flag that splits traffic between users, and select the appropriate type for each flag.

Flags should be called `delay`, `proceedToCheckout`, `freeDelivery`, and `summerSale` as seen in `flags.ts`
