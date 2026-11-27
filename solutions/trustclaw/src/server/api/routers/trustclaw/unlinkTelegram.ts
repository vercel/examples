import { TRPCError } from '@trpc/server'
import { protectedProcedure } from '~/server/api/trpc'
import { db } from '~/server/clients/db'

export const unlinkTelegram = protectedProcedure.mutation(async ({ ctx }) => {
  const userId = ctx.session.user.id

  return db.$transaction(async (tx) => {
    const instance = await tx.composioClawInstance.findUnique({
      where: { userId },
      select: { id: true },
    })

    if (!instance) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'No TrustClaw by Composio instance found',
      })
    }

    await tx.composioClawInstance.update({
      where: { id: instance.id },
      data: {
        telegramChatId: null,
        telegramLinkToken: null,
        telegramLinkTokenExpiresAt: null,
      },
    })

    return { success: true }
  })
})
