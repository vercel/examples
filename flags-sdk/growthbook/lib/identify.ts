import type { Identify } from 'flags'
import type { Attributes } from '@flags-sdk/growthbook'
import { dedupe } from 'flags/next'
import { getStableId } from './get-stable-id'

export const identify = dedupe(async () => {
  const stableId = await getStableId()

  return {
    id: stableId.value,
  }
}) satisfies Identify<Attributes>
