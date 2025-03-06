import type { Identify } from 'flags'
import type { StatsigUser } from '@flags-sdk/statsig'
import { dedupe } from 'flags/next'
import { getStableId } from './get-stable-id'

export const identify = dedupe(async () => {
  const stableId = await getStableId()

  return {
    customIDs: {
      stableID: stableId.value,
    },
  }
}) satisfies Identify<StatsigUser>
