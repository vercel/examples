import type { Identify } from 'flags'
import { dedupe } from 'flags/next'
import { getStableId } from './get-stable-id'
import { IIdentity } from 'flagsmith/types'

export const identify = dedupe(async () => {
  const stableId = await getStableId()

  // You would call traits.put() here to persist traits you identified,
  // but Flagsmith expects you to return a singular string as the identity.
  //
  // See https://docs.flagsmith.com/basic-features/managing-identities

  return stableId.value
}) satisfies Identify<IIdentity>
