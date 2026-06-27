import { TRPCError } from '@trpc/server'
import { protectedProcedure } from '~/server/api/trpc'
import { db } from '~/server/clients/db'
import { updateSettingsInput } from './updateSettings.schema'

export const updateSettings = protectedProcedure
  .input(updateSettingsInput)
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.session.user.id

    const instance = await db.composioClawInstance.findUnique({
      where: { userId },
    })

    if (!instance) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'TrustClaw by Composio instance not found',
      })
    }

    const [updated] = await db.$transaction([
      db.composioClawInstance.update({
        where: { userId },
        data: {
          ...(input.anthropicModel && { anthropicModel: input.anthropicModel }),
        },
        select: {
          id: true,
          anthropicModel: true,
          updatedAt: true,
        },
      }),
      ...(input.timezone
        ? [
            db.user.update({
              where: { id: userId },
              data: { timezone: input.timezone },
            }),
          ]
        : []),
    ])

    return updated
  })
