import { z } from 'zod'
import { protectedProcedure } from '~/server/api/trpc'
import { db } from '~/server/clients/db'
import { getMemoriesInput, memoryRow } from './getMemories.schema'

export const getMemories = protectedProcedure
  .input(getMemoriesInput)
  .query(async ({ ctx, input }) => {
    const userId = ctx.session.user.id

    const instance = await db.composioClawInstance.findUnique({
      where: { userId },
      select: { id: true },
    })

    if (!instance) {
      return { items: [], nextCursor: undefined }
    }

    const cursorDate = input.cursor ? new Date(input.cursor) : undefined

    const rows = await db.memory.findMany({
      where: {
        instanceId: instance.id,
        ...(cursorDate ? { createdAt: { lt: cursorDate } } : {}),
      },
      select: { id: true, content: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: input.limit + 1,
    })

    const hasNextPage = rows.length > input.limit
    const sliced = hasNextPage ? rows.slice(0, input.limit) : rows
    const items = z.array(memoryRow).parse(sliced)
    const nextCursor =
      hasNextPage && sliced.length > 0
        ? sliced[sliced.length - 1]!.createdAt.toISOString()
        : undefined

    return {
      items,
      nextCursor,
    }
  })
