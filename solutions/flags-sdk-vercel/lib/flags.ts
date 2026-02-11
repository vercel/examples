import { flag, dedupe } from 'flags/next'
import { vercelAdapter } from '@flags-sdk/vercel'

type Entities = {
  user?: { id: string; email?: string }
}

const identify = dedupe(async (): Promise<Entities> => {
  // In a real application, you would get the user from your session
  // For this example, we return a mock user
  return {
    user: {
      id: 'user-123',
    },
  }
})

export const showNewFeature = flag<boolean, Entities>({
  key: 'show-new-feature',
  adapter: vercelAdapter(),
  identify,
  description: 'Show the new feature banner',
  options: [
    { value: true, label: 'Enabled' },
    { value: false, label: 'Disabled' },
  ],
  decide: () => false,
})

export const headerVariant = flag<string, Entities>({
  key: 'header-variant',
  adapter: vercelAdapter(),
  identify,
  description: 'Which header variant to show',
  options: [
    { value: 'default', label: 'Default' },
    { value: 'compact', label: 'Compact' },
    { value: 'minimal', label: 'Minimal' },
  ],
  decide: () => 'default',
})
