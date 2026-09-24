import { protectedProcedure } from '~/server/api/trpc'
import { db } from '~/server/clients/db'
import { getStreamingMessage as getStreamingMessageFromRedis } from '~/server/clients/redis'

export const getStreamingMessage = protectedProcedure.query(async ({ ctx }) => {
  const userId = ctx.session.user.id

  const instance = await db.composioClawInstance.findUnique({
    where: { userId },
    select: { id: true },
  })

  if (!instance) return null

  const messageId = await getStreamingMessageFromRedis(instance.id)
  if (!messageId) return null

  return { messageId }
})
