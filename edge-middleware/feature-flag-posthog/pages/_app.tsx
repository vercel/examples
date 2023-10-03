import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'
import { getLayout } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'

import Cookies from 'js-cookie'
import { PostHog } from 'posthog-js'
import { usePostHog } from '@lib/posthog'
import { POSTHOG_HOST, POSTHOG_API_KEY } from '@lib/constants'

export default function MyApp({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  usePostHog(POSTHOG_API_KEY, {
    api_host: POSTHOG_HOST,
    loaded: (posthog: PostHog) => {
      // Set the distinct_id being used by PostHog on the client
      // so we can also use on the server.
      Cookies.set('distinct_id', posthog.get_distinct_id())
    },
  })

  return (
    <Layout
      title="AB testing with PostHog"
      path="edge-middleware/feature-flag-posthog"
      deployButton={{
        env: ['NEXT_PUBLIC_POSTHOG_PROJECT_API_KEY'],
      }}
    >
      <Component {...pageProps} />
    </Layout>
  )
}
