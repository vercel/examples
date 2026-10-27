import { TRPCError } from '@trpc/server'
import { protectedProcedure } from '~/server/api/trpc'
import { db } from '~/server/clients/db'
import { toggleCronJobInput } from './toggleCronJob.schema'
import { computeNextRunAt } from './agent/tools/cron-utils'

export const toggleCronJob = protectedProcedure
  .input(toggleCronJobInput)
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.session.user.id

    return db.$transaction(async (tx) => {
      const instance = await tx.composioClawInstance.findUnique({
        where: { userId },
        select: { id: true },
      })

      if (!instance) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'TrustClaw by Composio instance not found',
        })
      }

      const job = await tx.cronJob.findFirst({
        where: { id: input.jobId, instanceId: instance.id },
      })

      if (!job) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Cron job not found',
        })
      }

      const nextRunAt = input.enabled
        ? computeNextRunAt(job.expression, job.timezone)
        : null

      const updated = await tx.cronJob.update({
        where: { id: input.jobId },
        data: {
          enabled: input.enabled,
          nextRunAt,
          ...(input.enabled ? {} : { lockedAt: null, lockedBy: null }),
        },
        select: {
          id: true,
          enabled: true,
          nextRunAt: true,
        },
      })

      return updated
    })
  })
