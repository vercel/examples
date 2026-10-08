import 'server-only'
import { appOrigin, internalSecret } from '@/lib/env'

/**
 * Kicks the background processor for a run. The endpoint answers 202 at once
 * and does the work after the response, within its own function budget.
 */
export async function triggerRunProcessing(
  runId: number,
  requestOrigin?: string | null
): Promise<boolean> {
  const origin = appOrigin(requestOrigin)
  if (!origin) {
    console.warn('[run] cannot trigger processing: set APP_URL')
    return false
  }
  try {
    const response = await fetch(
      `${origin}/api/internal/runs/${runId}/process`,
      {
        method: 'POST',
        headers: { authorization: `Bearer ${internalSecret()}` },
        cache: 'no-store',
      }
    )
    if (!response.ok)
      console.warn(`[run] processing trigger returned ${response.status}`)
    return response.ok
  } catch (error) {
    console.error('[run] processing trigger failed', error)
    return false
  }
}
