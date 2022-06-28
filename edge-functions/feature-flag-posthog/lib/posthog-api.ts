import { type Flags, POSTHOG_API_KEY, POSTHOG_HOST } from './constants'

export type FlagValue = boolean | string | undefined

export type FlagsMatcher = {
  [x: string]:
    | {
        name: Flags
        rewrite(value: FlagValue): string
      }
    | undefined
}

/**
 * Retrieves the value of the feature flag.
 *
 * @param distinctUserId A unique identifier for the user
 * @param featureName The name of the feature flag
 * @returns If the feature flag is an A/B test, then the value may be true or undefined.
 *          If the feature flag is a multvariate, then the value will be a string
 */
export async function getFeatureFlagVariant(
  distinctUserId: string,
  featureName: Flags
): Promise<FlagValue> {
  if (!distinctUserId) {
    throw new Error(`distinctUserId is required and it can't be empty`)
  }

  const res = await fetch(`${POSTHOG_HOST}/decide?v=2`, {
    method: 'POST',
    body: JSON.stringify({
      api_key: POSTHOG_API_KEY,
      distinct_id: distinctUserId,
    }),
  })

  if (!res.ok) {
    throw new Error(
      `Fetch request to retrieve the ${featureName} flag status failed with: (${res.status}) ${res.statusText}`
    )
  }

  const data = await res.json()

  console.log('Your active flags:', JSON.stringify(data.featureFlags, null, 2))

  return data.featureFlags[featureName]
}
