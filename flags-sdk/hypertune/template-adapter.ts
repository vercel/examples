// When building new examples with a real adapter, you can delete this file and plug in your adpater instead.
import type { Adapter } from 'flags'
import { xxHash32 } from 'js-xxhash'

export interface TemplateEntities {
  visitor: { id: string }
  user?: { id: string }
  team?: { id: string }
}

interface TemplateAdapter {
  rollout: (percent: number) => Adapter<boolean, TemplateEntities>
  multivariant: <T>(variants: T[]) => Adapter<T, TemplateEntities>
}

export function createTemplateAdapter(): TemplateAdapter {
  return {
    rollout: (percent: number) => ({
      async decide({ key, entities }) {
        const bucket = xxHash32(`${entities?.visitor.id}${key}`)
        const result = bucket % 100 < percent
        return result
      },
    }),
    multivariant: (variants) => ({
      async decide({ key, entities }) {
        const bucket =
          xxHash32(`${entities?.visitor.id}${key}`) % variants.length
        const result = variants[bucket] ?? variants[0]
        return result
      },
    }),
  }
}

let defaultTemplateAdapter: TemplateAdapter | undefined

export function getTemplateAdapter(): TemplateAdapter {
  if (!defaultTemplateAdapter) {
    defaultTemplateAdapter = createTemplateAdapter()
  }
  return defaultTemplateAdapter
}

export const templateAdapter = {
  rollout: (percent: number) => getTemplateAdapter().rollout(percent),
  multivariant: <T>(variants: T[]) =>
    getTemplateAdapter().multivariant(variants),
}
