import type { Identify } from 'flags'
import type { Context } from '@flags-sdk/reflag'
import { dedupe } from 'flags/next'
import { getStableId } from './get-stable-id'

export const identify = dedupe(async () => {
  const stableId = await getStableId()

  return {
    company: {
      id: stableId.value,
    },
  }
}) satisfies Identify<Context>
