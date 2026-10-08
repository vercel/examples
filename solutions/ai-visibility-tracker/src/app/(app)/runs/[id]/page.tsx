import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/blocks'
import { RunProgressView } from '@/components/run-progress'
import { getDb } from '@/lib/db'
import { fmtDateTime } from '@/lib/format'
import { getBrand } from '@/lib/queries/brand'
import { runProgress } from '@/lib/queries/runs'

export const metadata: Metadata = { title: 'Check' }

export default async function RunPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const runId = Number(id)
  if (!Number.isInteger(runId)) notFound()
  const db = await getDb()
  const brand = (await getBrand(db))!
  const progress = await runProgress(db, brand.id, runId)
  if (!progress) notFound()

  return (
    <>
      <PageHeader
        title={`${
          progress.run.trigger === 'scheduled' ? 'Scheduled' : 'Manual'
        } check`}
        description={`Started ${fmtDateTime(progress.run.createdAt)}`}
      />
      <RunProgressView initial={progress} />
    </>
  )
}
