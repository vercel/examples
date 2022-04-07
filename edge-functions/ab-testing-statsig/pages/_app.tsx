import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'
import { StatsigProvider } from 'statsig-react'

import { getLayout } from '@vercel/examples-ui'
import Cookies from 'js-cookie'

import '@vercel/examples-ui/globals.css'

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  // middleware will automatically set a cookie for the user if they visit a page
  const userID = Cookies.get('uid')

  return (
    <StatsigProvider
      sdkKey={process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY!}
      waitForInitialization={false}
      user={{ userID }}
    >
      <Layout
        title="ab-testing-statsig"
        path="edge-functions/ab-testing-statsig"
      >
        <Component {...pageProps} />
      </Layout>
    </StatsigProvider>
  )
}

export default App
