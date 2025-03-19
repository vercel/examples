import type { Identify } from 'flags'
import { dedupe } from 'flags/next'
import { getStableId } from './get-stable-id'
import type { EvaluationContext } from '@openfeature/server-sdk'

export const identify: Identify<EvaluationContext> = dedupe(
  async (): Promise<EvaluationContext> => {
    const stableId = await getStableId()

    return { targetingKey: stableId.value }
  }
)
