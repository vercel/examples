import { NextResponse } from 'next/server'
import { Prisma } from '~/generated/prisma/client'
import { z } from 'zod'
import { env } from '~/env'
import { db } from '~/server/clients/db'
import { computeNextRunSafe } from '~/server/api/routers/trustclaw/agent/tools/cron-utils'

const LOCK_TIMEOUT_MS = 10 * 60 * 1000

const claimedJobRow = z.object({
  id: z.string(),
  instanceId: z.string(),
})

const staleJobRow = z.object({
  id: z.string(),
  expression: z.string(),
  timezone: z.string(),
})

function parseNowOverride(request: Request): Date {
  if (env.NODE_ENV !== 'development') return new Date()

  const url = new URL(request.url)
  const nowParam = url.searchParams.get('now')
  if (!nowParam) return new Date()

  const parsed = new Date(nowParam)
  if (isNaN(parsed.getTime())) return new Date()

  return parsed
}

export async function GET(request: Request) {
  // Vercel auto-injects CRON_SECRET when crons are declared in vercel.json and
  // sends `Authorization: Bearer <CRON_SECRET>` on cron-triggered requests.
  // In dev we allow unauthenticated calls so the local trigger script works.
  if (env.NODE_ENV !== 'development') {
    const auth = request.headers.get('authorization') ?? ''
    if (auth !== `Bearer ${env.CRON_SECRET}`) {
      return new Response('Unauthorized', { status: 401 })
    }
  }

  const now = parseNowOverride(request)
  const invocationId = crypto.randomUUID()
  const lockTimeout = new Date(now.getTime() - LOCK_TIMEOUT_MS)

  const claimedJobs = z.array(claimedJobRow).parse(
    await db.$queryRaw`
      UPDATE composio_claw_cron_job cj
      SET
        "lockedAt" = ${now},
        "lockedBy" = ${invocationId},
        "nextRunAt" = NULL
      FROM composio_claw_instance ci
      WHERE cj."instanceId" = ci.id
        AND cj.enabled = true
        AND (
          (cj."nextRunAt" <= ${now} AND cj."lockedAt" IS NULL)
          OR (cj."lockedAt" IS NOT NULL AND cj."lockedAt" < ${lockTimeout})
        )
      RETURNING cj.id, cj."instanceId"
    `
  )

  // Advance nextRunAt for past-due jobs that can't be claimed (disabled)
  const staleJobs = z.array(staleJobRow).parse(
    await db.$queryRaw`
      SELECT id, expression, timezone
      FROM composio_claw_cron_job
      WHERE "nextRunAt" <= ${now}
        AND "lockedAt" IS NULL
        AND enabled = false
    `
  )

  if (staleJobs.length > 0) {
    const values = staleJobs
      .map((job) => {
        const nextRunAt = computeNextRunSafe(job.expression, job.timezone)
        return nextRunAt
          ? Prisma.sql`(${job.id}, ${nextRunAt}::timestamptz)`
          : null
      })
      .filter((v): v is Prisma.Sql => v !== null)

    if (values.length > 0) {
      await db.$queryRaw`
        UPDATE composio_claw_cron_job AS cj
        SET "nextRunAt" = v."nextRunAt"::timestamptz
        FROM (VALUES ${Prisma.join(values)}) AS v(id, "nextRunAt")
        WHERE cj.id = v.id
      `
    }
  }

  if (claimedJobs.length === 0) {
    return NextResponse.json({
      dispatched: 0,
      results: [],
      now: now.toISOString(),
    })
  }

  // Group claimed jobs by instanceId for batched execution
  const jobsByInstance = new Map<string, string[]>()
  for (const job of claimedJobs) {
    const existing = jobsByInstance.get(job.instanceId)
    if (existing) {
      existing.push(job.id)
    } else {
      jobsByInstance.set(job.instanceId, [job.id])
    }
  }

  const executeUrl = `${env.NEXT_PUBLIC_APP_URL}/api/cron/trustclaw/execute`

  const entries = Array.from(jobsByInstance.entries())
  const results = await Promise.allSettled(
    entries.map(([, jobIds]) =>
      fetch(executeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Forward CRON_SECRET so /execute can authenticate the inbound call.
          Authorization: `Bearer ${env.CRON_SECRET}`,
        },
        body: JSON.stringify({
          jobIds,
          invocationId,
          nowOverride: now.toISOString(),
        }),
      })
    )
  )

  const dispatched = results.map((result, i) => ({
    instanceId: entries[i]![0],
    jobIds: entries[i]![1],
    status:
      result.status === 'fulfilled' && result.value.ok
        ? 'dispatched'
        : 'dispatch_failed',
  }))

  return NextResponse.json({
    dispatched: claimedJobs.length,
    instances: entries.length,
    results: dispatched,
    now: now.toISOString(),
  })
}
