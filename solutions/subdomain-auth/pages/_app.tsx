import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'

import { SessionProvider } from 'next-auth/react'
import { getLayout, Head } from '@vercel/examples-ui'

import '@vercel/examples-ui/globals.css'

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout path="solutions/subdomain-auth">
      <Head
        title="Securing routes with next-auth"
        description="How to secure subdomains using next-auth"
      />
      <SessionProvider>
        <Component {...pageProps} />
      </SessionProvider>
    </Layout>
  )
}

export default App
