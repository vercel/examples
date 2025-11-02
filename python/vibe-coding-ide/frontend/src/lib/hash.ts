// Lightweight content hashing suitable for change detection (not cryptographic)
export function computeContentHash(text: string): string {
  // djb2
  let hash = 5381
  const len = text.length
  for (let i = 0; i < len; i += 1) {
    hash = (hash << 5) + hash + text.charCodeAt(i)
    hash |= 0 // force 32-bit
  }
  // convert to unsigned hex
  const u = hash >>> 0
  return u.toString(16).padStart(8, '0')
}

export type FileHashes = Record<string, string>

export function computeProjectHashes(
  files: Record<string, string>,
  isIgnored?: (p: string) => boolean
): FileHashes {
  const out: FileHashes = {}
  for (const [p, c] of Object.entries(files || {})) {
    const normalized = (p || '').replace(/^\//, '')
    if (!normalized) continue
    if (isIgnored && isIgnored(normalized)) continue
    out[normalized] = computeContentHash(String(c ?? ''))
  }
  return out
}

export function decodeBase64ToText(contentBase64: string): string | null {
  try {
    if (typeof atob === 'function') {
      const bin = atob(contentBase64)
      // Convert binary string to UTF-8 text
      const bytes = new Uint8Array(bin.length)
      for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i)
      const dec = new TextDecoder('utf-8')
      return dec.decode(bytes)
    }
  } catch {
    // ignore
  }
  return null
}
