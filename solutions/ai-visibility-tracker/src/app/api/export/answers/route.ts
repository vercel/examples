import { getDb } from '@/lib/db'
import { toCsv } from '@/lib/export/csv'
import { platformLabel } from '@/lib/platforms'
import { answersForExport } from '@/lib/queries/answers'
import { getBrand } from '@/lib/queries/brand'
import { parsePeriod, periodRange } from '@/lib/queries/period'

export const dynamic = 'force-dynamic'

/** CSV of every completed answer in the period (session-protected by the proxy). */
export async function GET(request: Request): Promise<Response> {
  const db = await getDb()
  const brand = await getBrand(db)
  if (!brand) return Response.json({ error: 'No brand' }, { status: 404 })

  const period = parsePeriod(new URL(request.url).searchParams.get('period'))
  const range = periodRange(period)
  const rows = await answersForExport(db, brand.id, range.since)
  const csv = toCsv(
    rows.map((row) => ({
      date: row.completedAt,
      question: row.question,
      platform: platformLabel(row.platform),
      model: row.modelId,
      brand_mentioned: row.brandMentioned,
      website_cited: row.brandCited,
      brand_position: row.brandPosition,
      brands_named: row.brandsNamed,
      sources: row.sources.map((s) => s.url).join(' '),
      answer: row.text,
    })),
    [
      'date',
      'question',
      'platform',
      'model',
      'brand_mentioned',
      'website_cited',
      'brand_position',
      'brands_named',
      'sources',
      'answer',
    ]
  )
  const stamp = new Date().toISOString().slice(0, 10)
  return new Response(csv, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="ai-visibility-answers-${period}-${stamp}.csv"`,
      'cache-control': 'no-store',
    },
  })
}
