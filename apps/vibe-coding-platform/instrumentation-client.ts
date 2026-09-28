import { initBotId } from 'botid/client/core'

initBotId({
  protect: [
    {
      path: '/api/projects',
      method: 'POST',
    },
    { path: '/api/errors', method: 'POST' },
    { path: '/api/agent/*', method: 'POST' },
    { path: '/api/sandboxes/*', method: 'POST' },
  ],
})
