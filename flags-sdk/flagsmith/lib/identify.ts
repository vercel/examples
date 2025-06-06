import type { Identify } from 'flags'
import { dedupe } from 'flags/next'
import { getStableId } from './get-stable-id'
import type { EntitiesType } from '@flags-sdk/flagsmith'

export const identify: Identify<EntitiesType> = dedupe(
  async (): Promise<EntitiesType> => {
    const stableId = await getStableId()
    return  stableId.value
  }
)