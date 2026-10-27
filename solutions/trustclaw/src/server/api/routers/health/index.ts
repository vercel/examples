import { router } from '~/server/api/trpc'
import { ping } from './ping'

export const healthRouter = router({
  ping,
})
