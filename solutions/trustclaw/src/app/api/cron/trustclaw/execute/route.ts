import { after, NextResponse } from 'next/server'
import { Prisma } from '~/generated/prisma/client'
import { z } from 'zod'
import { env } from '~/env'
import { db } from '~/server/clients/db'
import { prepareAgentRun } from '~/server/api/routers/trustclaw/agent/setup'
import { computeNextRunSafe } from '~/server/api/routers/trustclaw/agent/tools/cron-utils'
import { stripToolResultEchoes } from '~/server/api/routers/trustclaw/agent/strip-tool-echoes'
import { sendTelegramMessage } from '~/server/clients/telegram'
import { executeJobInput, cronJobRow, type CronJobRow } from './route.schema'

async function loadJobsFromDb(jobIds: string[]) {
  const rows = z.array(cronJobRow).parse(
    await db.$queryRaw`
      SELECT
        cj.id,
        cj."instanceId",
        cj.expression,
        cj.prompt,
        cj.timezone,
        cj."lockedBy",
        ci."telegramChatId"
      FROM composio_claw_cron_job cj
      JOIN composio_claw_instance ci ON cj."instanceId" = ci.id
      WHERE cj.id IN (${Prisma.join(jobIds)})
    `
  )

  return rows
}

async function releaseJobLocks(
  jobs: CronJobRow[],
  invocationId: string,
  now: Date,
  error?: string
) {
  const values = jobs.map((job) => {
    const nextRunAt = computeNextRunSafe(job.expression, job.timezone)
    return nextRunAt
      ? Prisma.sql`(${job.id}, ${nextRunAt}::timestamptz)`
      : Prisma.sql`(${job.id}, NULL::timestamptz)`
  })

  await db.$queryRaw`
    UPDATE composio_claw_cron_job AS cj
    SET
      "lastRunAt" = CASE WHEN ${
        error ?? null
      }::text IS NULL THEN ${now}::timestamptz ELSE cj."lastRunAt" END,
      "nextRunAt" = v."nextRunAt"::timestamptz,
      "lockedAt" = NULL,
      "lockedBy" = NULL,
      "lastError" = ${error ?? null}
    FROM (VALUES ${Prisma.join(values)}) AS v(id, "nextRunAt")
    WHERE cj.id = v.id
      AND cj."lockedBy" = ${invocationId}
  `
}

async function executeJobs(
  jobs: CronJobRow[],
  invocationId: string,
  nowOverride?: string
) {
  const now = nowOverride ? new Date(nowOverride) : new Date()
  const instanceId = jobs[0]!.instanceId
  const telegramChatId = jobs[0]!.telegramChatId

  try {
    // Combine all prompts into a single user message
    const combinedMessage = jobs
      .map((j) => `<scheduled-task>\n${j.prompt}\n</scheduled-task>`)
      .join('\n\n')

    const prepareResult = await prepareAgentRun({
      instanceId,
      userMessage: combinedMessage,
      source: 'cron',
      userMessageType: 'hidden',
    })

    const { agent, messages } = prepareResult.result

    const result = await agent.generate({ prompt: messages })

    // Release all job locks in a single query (each gets its own nextRunAt)
    await releaseJobLocks(jobs, invocationId, now)

    // Forward to Telegram if linked
    if (telegramChatId) {
      const cleanedText = stripToolResultEchoes(result.text)
      if (cleanedText) {
        const truncated =
          cleanedText.length > 4096
            ? cleanedText.slice(0, 4093) + '...'
            : cleanedText
        try {
          await sendTelegramMessage(telegramChatId, truncated)
        } catch (error) {
          console.error('[cron/execute] telegram delivery failed:', error)
        }
      }
    }
  } catch (error) {
    console.error('[cron/execute] job execution failed:', error)

    try {
      await releaseJobLocks(
        jobs,
        invocationId,
        now,
        'Scheduled task execution failed'
      )
    } catch (releaseError) {
      console.error('[cron/execute] lock release failed:', releaseError)
    }
  }
}

export const maxDuration = 60

export async function POST(request: Request) {
  // Bearer-auth via CRON_SECRET (auto-injected by Vercel for cron-triggered
  // routes; the dispatcher /api/cron/trustclaw forwards it on internal fetch).
  // Dev mode allows unauthenticated calls so the local trigger script works.
  if (env.NODE_ENV !== 'development') {
    const auth = request.headers.get('authorization') ?? ''
    if (auth !== `Bearer ${env.CRON_SECRET}`) {
      return new Response('Unauthorized', { status: 401 })
    }
  }

  const body: unknown = await request.json()
  const parsed = executeJobInput.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request body', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { jobIds, invocationId, nowOverride } = parsed.data

  const jobs = await loadJobsFromDb(jobIds)

  if (jobs.length === 0) {
    return NextResponse.json({ error: 'No jobs found' }, { status: 404 })
  }

  // Filter to jobs with valid fencing tokens
  const validJobs = jobs.filter((job) => job.lockedBy === invocationId)

  if (validJobs.length === 0) {
    return NextResponse.json(
      { error: 'Fencing token mismatch for all jobs' },
      { status: 403 }
    )
  }

  after(executeJobs(validJobs, invocationId, nowOverride))

  return NextResponse.json(
    { status: 'accepted', jobCount: validJobs.length },
    { status: 202 }
  )
}
