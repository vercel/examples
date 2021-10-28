import { FEATURE_FLAGS } from './constants'

/**
 * Checks if a feature flag is enabled.
 *
 * @param distinctUserId A unique identifier for the user
 * @param featureName The name of the feature flag
 * @returns true if the feature flag is enabled. Otherwise, false.
 */
export async function isFeatureFlagEnabled(
  distinctUserId: string,
  featureName: FEATURE_FLAGS
): Promise<boolean> {
  console.log('isFeatureEnabled', distinctUserId, featureName)

  const featureFlagValue = await getFeatureFlagVariant(
    distinctUserId,
    featureName
  )

  const featureEnabled = featureFlagValue ? true : false
  console.log('featureEnabled', featureEnabled)

  return featureEnabled
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
  featureName: FEATURE_FLAGS
): Promise<string | boolean | undefined> {
  console.log('getFeatureFlagVariant', distinctUserId, featureName)

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_POSTHOG_HOST}/decide?v=2`,
    {
      method: 'POST',
      body: JSON.stringify({
        api_key: process.env.NEXT_PUBLIC_POSTHOG_PROJECT_API_KEY,
        distinct_id: distinctUserId,
      }),
    }
  )

  if (!res.ok) {
    throw new Error(
      `Fetch request to retrieve the ${featureName} flag status failed with: (${res.status}) ${res.statusText}`
    )
  }

  const data = await res.json()
  console.log(data)

  return data.featureFlags[featureName]
}
