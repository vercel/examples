import { protectedProcedure } from '~/server/api/trpc'
import { db } from '~/server/clients/db'
import { saveOnboardingStateInput } from './saveOnboardingState.schema'

export const saveOnboardingState = protectedProcedure
  .input(saveOnboardingStateInput)
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.session.user.id

    await db.onboardingState.upsert({
      where: { userId },
      create: {
        userId,
        currentStep: input.currentStep,
        name: input.name,
        writingStyle: input.writingStyle,
        personality: input.personality,
        emoji: input.emoji,
        lore: input.lore,
        anthropicModel: input.anthropicModel,
      },
      update: {
        currentStep: input.currentStep,
        name: input.name,
        writingStyle: input.writingStyle,
        personality: input.personality,
        emoji: input.emoji,
        lore: input.lore,
        anthropicModel: input.anthropicModel,
      },
    })

    return { success: true }
  })
