import { protectedProcedure } from '~/server/api/trpc'
import { db } from '~/server/clients/db'
import { isTelegramConfigured } from '~/server/clients/telegram'

export const getInstance = protectedProcedure.query(async ({ ctx }) => {
  const userId = ctx.session.user.id

  const [instance, onboardingState, user] = await db.$transaction([
    db.composioClawInstance.findUnique({
      where: { userId },
      select: {
        id: true,
        userId: true,
        anthropicModel: true,
        telegramChatId: true,
        telegramLinkToken: true,
        telegramLinkTokenExpiresAt: true,
        soulPrompt: true,
        identityPrompt: true,
        userPrompt: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    db.onboardingState.findUnique({
      where: { userId },
      select: {
        currentStep: true,
        name: true,
        writingStyle: true,
        personality: true,
        emoji: true,
        lore: true,
        anthropicModel: true,
      },
    }),
    db.user.findUnique({
      where: { id: userId },
      select: { timezone: true },
    }),
  ])

  return {
    instance: instance ?? null,
    onboardingState: onboardingState ?? null,
    timezone: user?.timezone ?? 'UTC',
    telegramConfigured: isTelegramConfigured(),
  }
})
