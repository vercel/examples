import type { Snapshot } from '../types/sandbox'
import { computeContentHash, decodeBase64ToText } from './hash'

type FsDelta = {
  created?: string[]
  updated?: string[]
  deleted?: string[]
  data?: Array<{ path: string; encoding?: string; content?: string }>
}

export function buildSandboxSnapshot(
  previous: Snapshot | undefined,
  previousData: Record<string, string> | undefined,
  delta: FsDelta
): { snapshot: Snapshot; lastData: Record<string, string> } {
  const prevHashes = (previous?.fileHashes || {}) as Record<string, string>
  const nextHashes: Record<string, string> = { ...prevHashes }
  const lastData: Record<string, string> = { ...(previousData || {}) }

  const normalize = (p: string | undefined | null) =>
    (p || '').replace(/^\.?\//, '')

  // Apply deletions first
  for (const p of delta.deleted || []) {
    const n = normalize(p)
    if (!n) continue
    delete nextHashes[n]
    delete lastData[n]
  }

  // Apply data payloads (content updates)
  for (const entry of delta.data || []) {
    const p = normalize(entry.path)
    if (!p) continue
    let text: string | null = null
    if (entry.encoding === 'base64' && typeof entry.content === 'string') {
      text = decodeBase64ToText(entry.content)
    } else if (typeof entry.content === 'string') {
      text = entry.content
    }
    if (text !== null) {
      nextHashes[p] = computeContentHash(text)
      lastData[p] = text
    }
  }

  // For created/updated without content in data, keep existing hash if any; we can't safely compute a new one.
  // This keeps diffs conservative and avoids false positives.

  const snapshot: Snapshot = {
    at: new Date().toISOString(),
    fileHashes: nextHashes,
  }
  return { snapshot, lastData }
}
