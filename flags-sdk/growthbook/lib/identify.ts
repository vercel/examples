import type { Identify } from 'flags'
import type { Attributes } from '@flags-sdk/growthbook'
import { dedupe } from 'flags/next'
import { getStableId } from './get-stable-id'

export const identify = dedupe(async () => {
  const id = await getStableId()

  return {
    id,
  }
}) satisfies Identify<Attributes>
