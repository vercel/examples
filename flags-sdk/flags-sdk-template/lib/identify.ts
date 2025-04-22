import type { Identify } from 'flags'
import { dedupe } from 'flags/next'
import { getStableId } from './get-stable-id'
import type { TemplateEntities } from '../template-adapter'

export const identify = dedupe(async () => {
  const stableId = await getStableId()
  const visitor = { id: stableId }
  return { visitor }
}) satisfies Identify<TemplateEntities>
