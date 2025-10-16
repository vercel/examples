import type { Identify } from 'flags'
import { dedupe } from 'flags/next'
import { getStableId } from './get-stable-id'
import type { EntitiesType } from '@flags-sdk/flagsmith'

export const identify = dedupe(async () => {
  const stableId = await getStableId()
  return {
    targetingKey: stableId.value,
  }
}) satisfies Identify<EntitiesType>
