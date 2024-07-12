import { svelteColor } from '$lib/flags'

export async function load() {
  return {
    // Requests the feature flag and returns its value
    svelteColor: await svelteColor(),
  }
}
