import type { EntitiesType } from '@flags-sdk/flagsmith'
import type { Identify } from 'flags'
import { dedupe } from 'flags/next'
import { getStableId } from './get-stable-id'

export const identify = dedupe(async () => {
  const stableId = await getStableId()
  return {
    targetingKey: stableId.value,
    traits: {},
  }
}) satisfies Identify<EntitiesType>
