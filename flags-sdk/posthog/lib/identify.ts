import type { Identify } from 'flags'
import { dedupe } from 'flags/next'
import { getStableId } from './get-stable-id'

export type PostHogEntities = {
  distinctId: string
}

export const identify = dedupe(async () => {
  const stableId = await getStableId()

  return { distinctId: stableId.value }
}) satisfies Identify<PostHogEntities>
