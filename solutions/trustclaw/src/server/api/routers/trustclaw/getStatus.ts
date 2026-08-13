import { protectedProcedure } from '~/server/api/trpc'
import { db } from '~/server/clients/db'
import { isTelegramConfigured } from '~/server/clients/telegram'

export const getStatus = protectedProcedure.query(async ({ ctx }) => {
  const userId = ctx.session.user.id

  const instance = await db.composioClawInstance.findUnique({
    where: { userId },
    select: { id: true },
  })

  const hasOnboardingState = instance
    ? false
    : await db.onboardingState.count({ where: { userId } }).then((c) => c > 0)

  return {
    hasInstance: !!instance,
    hasOnboardingState,
    telegramConfigured: isTelegramConfigured(),
  }
})
