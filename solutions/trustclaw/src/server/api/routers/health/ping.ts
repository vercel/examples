import { publicProcedure } from '~/server/api/trpc'

export const ping = publicProcedure.query(() => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})
