import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'

import { SessionProvider } from 'next-auth/react'
import { getLayout } from '@vercel/examples-ui'

import '@vercel/examples-ui/globals.css'

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout
      title="Securing routes with next-auth"
      path="solutions/subdomain-auth"
      description="How to secure subdomains using next-auth"
    >
      <SessionProvider>
        <Component {...pageProps} />
      </SessionProvider>
    </Layout>
  )
}

export default App
