import { router } from '~/server/api/trpc'
import { getToolkits } from './getToolkits'
import { getAuthLink } from './getAuthLink'

export const toolkitsRouter = router({
  getToolkits,
  getAuthLink,
})
