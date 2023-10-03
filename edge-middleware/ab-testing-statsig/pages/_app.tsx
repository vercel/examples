import type { AppProps } from 'next/app'
import { StatsigProvider } from 'statsig-react'
import Cookies from 'js-cookie'
import type { LayoutProps } from '@vercel/examples-ui/layout'
import { getLayout } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'
import { UID_COOKIE } from '../lib/constants'

function App({ Component, pageProps }: AppProps) {
  // Middleware will automatically set a cookie for the user if they visit a page
  const userID = Cookies.get(UID_COOKIE)
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <StatsigProvider
      sdkKey={process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY!}
      waitForInitialization={false}
      user={{ userID }}
    >
      <Layout
        title="Experimentation with Statsig"
        description="How to do experimentation with Statsig"
        path="edge-middleware/ab-testing-statsig"
      >
        <Component {...pageProps} />
      </Layout>
    </StatsigProvider>
  )
}

export default App
