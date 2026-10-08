import 'server-only'

export function onVercel(): boolean {
  return Boolean(process.env.VERCEL)
}

/** Public origin used when the run processor re-invokes itself. */
export function appOrigin(requestOrigin?: string | null): string | null {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, '')
  if (requestOrigin) return requestOrigin
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  return null
}

type GlobalWithSecret = typeof globalThis & {
  __aiVisibilityInternalSecret?: string
}

/**
 * Secret that protects the cron and run-processing endpoints. CRON_SECRET is
 * what Vercel Cron sends; locally an ephemeral per-process secret keeps
 * `next dev` working without configuration.
 */
export function internalSecret(): string {
  if (process.env.CRON_SECRET) return process.env.CRON_SECRET
  const g = globalThis as GlobalWithSecret
  if (!g.__aiVisibilityInternalSecret) {
    g.__aiVisibilityInternalSecret = `${crypto.randomUUID()}${crypto.randomUUID()}`
  }
  return g.__aiVisibilityInternalSecret
}

export function isInternalRequest(request: Request): boolean {
  const header = request.headers.get('authorization') ?? ''
  const expected = `Bearer ${internalSecret()}`
  if (header.length !== expected.length) return false
  let diff = 0
  for (let i = 0; i < header.length; i += 1)
    diff |= header.charCodeAt(i) ^ expected.charCodeAt(i)
  return diff === 0
}

/** Wall-clock budget of one processing invocation (see README "How runs work"). */
export function runBatchBudgetMs(): number {
  const raw = Number(process.env.RUN_BATCH_BUDGET_MS)
  return Number.isFinite(raw) && raw > 10_000 ? raw : 140_000
}
