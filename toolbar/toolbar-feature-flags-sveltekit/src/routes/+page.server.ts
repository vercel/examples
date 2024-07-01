import { shouldUseSvelteColor } from '$lib/flags'

export async function load() {
  return {
    // Requests the feature flag and returns its value
    useSvelteColor: await shouldUseSvelteColor(),
  }
}
