import { TRPCError } from '@trpc/server'
import { protectedProcedure } from '~/server/api/trpc'
import { db } from '~/server/clients/db'
import { deleteCronJobInput } from './deleteCronJob.schema'

export const deleteCronJob = protectedProcedure
  .input(deleteCronJobInput)
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

      await tx.cronJob.delete({ where: { id: input.jobId } })

      return { success: true }
    })
  })
