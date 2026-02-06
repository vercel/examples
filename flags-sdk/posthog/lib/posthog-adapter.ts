import { createPostHogAdapter } from '@flags-sdk/posthog'

// Support both Vercel Marketplace integration env vars and manual setup env vars
// Marketplace provides: POSTHOG_PROJECT_API_KEY, POSTHOG_HOST
// Manual setup uses: NEXT_PUBLIC_POSTHOG_KEY, NEXT_PUBLIC_POSTHOG_HOST
const postHogKey =
  process.env.NEXT_PUBLIC_POSTHOG_KEY || process.env.POSTHOG_PROJECT_API_KEY
const postHogHost =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ||
  process.env.POSTHOG_HOST ||
  'https://us.i.posthog.com'

if (!postHogKey) {
  throw new Error(
    'Missing PostHog API key. Set NEXT_PUBLIC_POSTHOG_KEY or install the PostHog Vercel Marketplace integration.'
  )
}

export const postHogAdapter = createPostHogAdapter({
  postHogKey,
  postHogOptions: {
    host: postHogHost,
  },
})
