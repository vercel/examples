import { router, createCallerFactory } from './trpc'
import { healthRouter } from './routers/health'
import { trustclawRouter } from './routers/trustclaw'
import { toolkitsRouter } from './routers/toolkits'

export const appRouter = router({
  health: healthRouter,
  trustclaw: trustclawRouter,
  toolkits: toolkitsRouter,
})

export type AppRouter = typeof appRouter
export const createCaller = createCallerFactory(appRouter)
