# PostHog Flags SDK Example

This example uses [PostHog](https://posthog.com) for feature flags with the [Flags SDK](https://flags-sdk.dev) along with the `@flags-sdk/posthog` [PostHog adapter](https://flags-sdk.dev/providers/posthog) and the [Flags Explorer](https://vercel.com/docs/workflow-collaboration/feature-flags/using-vercel-toolbar).

## Demo

[https://flags-sdk-posthog.vercel.app/](https://flags-sdk-posthog.vercel.app/)

## How it works

This demo uses two feature flags in PostHog to control the visibility of two banners on the page.
Both gates are configured to show/hide each banner 50% of the time.

If you deploy your own and configure the feature flags in PostHog, you can also use the [Flags Explorer](https://vercel.com/docs/workflow-collaboration/feature-flags/using-vercel-toolbar) to enabled/disabled the features.

## Deploy this template

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fflags-sdk/posthog&env=FLAGS_SECRET&envDescription=The+FLAGS_SECRET+will+be+used+by+the+Flags+Explorer+to+securely+overwrite+feature+flags.+Must+be+32+random+bytes%2C+base64-encoded.+Use+the+generated+value+or+set+your+own.&envLink=https%3A%2F%2Fvercel.com%2Fdocs%2Fworkflow-collaboration%2Ffeature-flags%2Fsupporting-feature-flags%23flags_secret-environment-variable&project-name=posthog-flags-sdk-example&repository-name=posthog-flags-sdk-example)

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

### Step 3: Create Feature Flags

Head over to [PostHog](posthog.com) and create the feature flags required by this template.

Feature Flags:

- `Summer Sale` with the key `summer_sale`
- `Free Shipping` with the key `free_delivery`

You can also find the feature flag keys in the `flags.ts` file.

Set both feature flags to rollout to 50% of users.
