import { TRPCError } from '@trpc/server'
import { protectedProcedure } from '~/server/api/trpc'
import { db } from '~/server/clients/db'

export const deleteInstance = protectedProcedure.mutation(async ({ ctx }) => {
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

    await tx.message.deleteMany({
      where: { instanceId: instance.id },
    })
    await tx.cronJob.deleteMany({
      where: { instanceId: instance.id },
    })
    await tx.$queryRaw`DELETE FROM composio_claw_memory WHERE "instanceId" = ${instance.id}`
    await tx.composioClawInstance.delete({
      where: { id: instance.id },
    })

    return { success: true }
  })
})
