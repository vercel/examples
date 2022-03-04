import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import type { LayoutProps } from '@vercel/examples-ui/layout'

import { getLayout } from '@vercel/examples-ui'

import '@vercel/examples-ui/globals.css'

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  const router = useRouter()

  useEffect(() => {
    const logPageView = (slug: string) => {
      fetch(`/api/log-page-view?slug=${slug}`, {
        method: 'POST',
      })
    }
    router.events.on('routeChangeComplete', logPageView)
    return () => {
      router.events.off('routeChangeComplete', logPageView)
    }
  }, [router])

  return (
    <Layout
      title="Serverside Analytics"
      path="edge-functions/serverside-analytics"
    >
      <Component {...pageProps} />
    </Layout>
  )
}

export default App
