import { getDb } from '@/lib/db'
import { getBrand } from '@/lib/queries/brand'
import { runProgress } from '@/lib/queries/runs'

export const dynamic = 'force-dynamic'

/** Progress of a run for the live run page (session-protected by the proxy). */
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await context.params
  const runId = Number(id)
  if (!Number.isInteger(runId))
    return Response.json({ error: 'Invalid run id' }, { status: 400 })
  const db = await getDb()
  const brand = await getBrand(db)
  if (!brand) return Response.json({ error: 'No brand' }, { status: 404 })
  const progress = await runProgress(db, brand.id, runId)
  if (!progress) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json(progress, { headers: { 'cache-control': 'no-store' } })
}
