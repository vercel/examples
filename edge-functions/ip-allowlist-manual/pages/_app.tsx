import type { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import type { LayoutProps } from '@vercel/examples-ui/layout'
import { getLayout } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout
      title="IP Blocking with Datadome"
      path="edge-functions/ip-blocking-datadome"
      deployButton={{
        env: [
          'NEXT_PUBLIC_DATADOME_CLIENT_KEY',
          'DATADOME_SERVER_KEY',
          'DATADOME_MANAGEMENT_KEY',
        ],
      }}
    >
      <Component {...pageProps} />
    </Layout>
  )
}
