import s from './splits.json'
import { SPLITS } from './split'

type Split = typeof s.objects[0]

/**
 * Returns a treatment from the cached splits, if the value has default rules set it will
 * randomly pick one based on each rule' percentage.
 *
 * NOTE: This code is not production ready, there are many things you can do with Split
 * besides checking for default rules.
 */
export function getTreatment(key: string, name: SPLITS): string {
  const splits: Split[] = s.objects
  const split = splits.find((s) => s.name === name)

  if (!split) {
    throw new Error(`Could not find a split with the name "${name}"`)
  }

  let n = Math.random() * 100

  return split.defaultRule.find((rule) => {
    if (rule.size >= n) return true
    n -= rule.size
  })?.treatment
}
