import { defineConfig } from '@trigger.dev/sdk/v3'

export default defineConfig({
  project: 'proj-your-project-id', // Replace with your actual project ID from trigger.dev dashboard
  maxDuration: 300, // Maximum duration in seconds (5 minutes)
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },
  dirs: ['./trigger'], // Where your trigger tasks are located
})
