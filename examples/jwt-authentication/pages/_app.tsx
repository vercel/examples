import type { AppProps } from 'next/app'
import Head from 'next/head'
import { getLayout } from '@edge-functions/ui'
import '@edge-functions/ui/globals.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  const Layout = getLayout(Component)

  return (
    <Layout pageProps={pageProps}>
      <Head>
        <title>Vercel Edge Functions - JWT Authentication</title>
      </Head>
      <Component {...pageProps} />
    </Layout>
  )
}
