import { router } from '~/server/api/trpc'
import { getInstance } from './getInstance'
import { getStatus } from './getStatus'
import { createInstance } from './createInstance'
import { updateSettings } from './updateSettings'
import { deleteInstance } from './deleteInstance'
import { linkTelegram } from './linkTelegram'
import { unlinkTelegram } from './unlinkTelegram'
import { getCronJobs } from './getCronJobs'
import { toggleCronJob } from './toggleCronJob'
import { deleteCronJob } from './deleteCronJob'
import { getHistory } from './getHistory'
import { getStreamingMessage } from './getStreamingMessage'
import { getMemories } from './getMemories'
import { getIntegrationAuthLinks } from './getIntegrationAuthLinks'
import { saveOnboardingState } from './saveOnboardingState'
import { checkConnectionStatus } from './checkConnectionStatus'

export const trustclawRouter = router({
  getInstance,
  getStatus,
  createInstance,
  updateSettings,
  deleteInstance,
  linkTelegram,
  unlinkTelegram,
  getCronJobs,
  toggleCronJob,
  deleteCronJob,
  getHistory,
  getStreamingMessage,
  getMemories,
  getIntegrationAuthLinks,
  saveOnboardingState,
  checkConnectionStatus,
})
