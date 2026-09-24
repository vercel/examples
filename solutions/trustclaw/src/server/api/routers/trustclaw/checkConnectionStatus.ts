import { protectedProcedure } from '~/server/api/trpc'
import { createComposioClient } from '~/server/clients/composio'
import { checkConnectionStatusInput } from './checkConnectionStatus.schema'

export const checkConnectionStatus = protectedProcedure
  .input(checkConnectionStatusInput)
  .query(async ({ ctx, input }) => {
    const userId = ctx.session.user.id
    const composio = createComposioClient()
    const session = await composio.create(userId, {})

    const toolkitsInfo = await session.toolkits({
      toolkits: input.toolkits,
    })

    const statuses = input.toolkits.map((toolkit) => {
      const info = toolkitsInfo.items.find((i) => i.slug === toolkit)
      return {
        toolkit,
        connected: !!info?.connection?.isActive,
      }
    })

    return { statuses }
  })
