import { dedupe } from 'flags/next'
import type { Identify } from 'flags'
import { getStableId } from './get-stable-id'
import type { Context } from '../generated/hypertune'

export const identify: Identify<Context> = dedupe(async () => {
  const stableId = await getStableId()
  const environment =
    process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? 'development'
  return {
    stableId,
    environment: environment as 'development' | 'production' | 'test',
  }
})
