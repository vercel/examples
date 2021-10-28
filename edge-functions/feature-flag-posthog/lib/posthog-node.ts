import { FEATURE_FLAGS } from './constants'

/**
 * Checks if a feature flag is enabeld.
 */
export async function isFeatureFlagEnabled(
  distinctUserId: string,
  featureName: FEATURE_FLAGS
): Promise<boolean> {
  console.log('isFeatureEnabled', distinctUserId, featureName)

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

  const featureEnabled = data.featureFlags[featureName] || false
  console.log('featureEnabled', featureEnabled)

  return featureEnabled
}
