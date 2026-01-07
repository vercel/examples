# PostHog Flags SDK Example

This example uses [PostHog](https://posthog.com) for feature flags with the [Flags SDK](https://flags-sdk.dev) along with the `@flags-sdk/posthog` [PostHog adapter](https://flags-sdk.dev/providers/posthog) and the [Flags Explorer](https://vercel.com/docs/workflow-collaboration/feature-flags/using-vercel-toolbar).

## Demo

[https://flags-sdk-posthog.vercel.app/](https://flags-sdk-posthog.vercel.app/)

## How it works

This demo uses two feature flags in PostHog to control the visibility of two banners on the page.
Both gates are configured to show/hide each banner 50% of the time.

If you deploy your own and configure the feature flags in PostHog, you can also use the [Flags Explorer](https://vercel.com/docs/workflow-collaboration/feature-flags/using-vercel-toolbar) to enabled/disabled the features.

## Deploy this template

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fflags-sdk%2Fposthog&env=FLAGS_SECRET&envDescription=The+FLAGS_SECRET+will+be+used+by+the+Flags+Explorer+to+securely+overwrite+feature+flags.+Must+be+32+random+bytes%2C+base64-encoded.+Use+the+generated+value+or+set+your+own.&envLink=https%3A%2F%2Fvercel.com%2Fdocs%2Fworkflow-collaboration%2Ffeature-flags%2Fsupporting-feature-flags%23flags_secret-environment-variable&project-name=posthog-flags-sdk-example&repository-name=posthog-flags-sdk-example&products=%5B%7B%22type%22%3A%22integration%22%2C%22integrationSlug%22%3A%22posthog%22%2C%22productSlug%22%3A%22posthog%22%2C%22protocol%22%3A%22experimentation%22%7D%5D)

Clicking the button above will:

1. Clone this repository to your GitHub account
2. Create a new Vercel project
3. Install the PostHog integration from the Vercel Marketplace (automatically configures `POSTHOG_PROJECT_API_KEY` and `POSTHOG_HOST`)
4. Prompt you to generate a `FLAGS_SECRET` for the Flags Explorer

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

Head over to [PostHog](https://posthog.com) and create the feature flags required by this template.

Feature Flags:

- `Summer Sale` with the key `summer_sale`
- `Free Shipping` with the key `free_delivery`

You can also find the feature flag keys in the `flags.ts` file.

Set both feature flags to rollout to 50% of users.

## Manual Setup (without Marketplace integration)

If you prefer not to use the Vercel Marketplace integration, you can manually configure the environment variables:

1. Set `NEXT_PUBLIC_POSTHOG_KEY` to your PostHog project API key
2. Set `NEXT_PUBLIC_POSTHOG_HOST` to your PostHog host (e.g., `https://us.i.posthog.com`)
3. Set `FLAGS_SECRET` to a base64-encoded 32-byte random value

For the Flags Explorer feature, also set:

- `POSTHOG_PERSONAL_API_KEY` - Your PostHog personal API key
- `POSTHOG_PROJECT_ID` - Your PostHog project ID
