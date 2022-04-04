import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'
import { StatsigProvider } from 'statsig-react'

import { getLayout } from '@vercel/examples-ui'

import '@vercel/examples-ui/globals.css'
import Cookies from 'js-cookie'

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  // middleware will automatically set a cookie for the user if they visit a page
  const userID = Cookies.get('userId')

  return (
    <StatsigProvider
      sdkKey={process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY!}
      waitForInitialization={true}
      user={{ userID }}
    >
      <Layout title="statsig-metric" path="solutions/statsig-metric">
        <Component {...pageProps} />
      </Layout>
    </StatsigProvider>
  )
}

export default App
