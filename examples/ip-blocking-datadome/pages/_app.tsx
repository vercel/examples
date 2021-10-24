import type { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import type { LayoutProps } from '@vercel/edge-functions-ui/layout'
import { getLayout } from '@vercel/edge-functions-ui'
import '@vercel/edge-functions-ui/globals.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <SWRConfig
      value={{
        refreshInterval: 40000,
        revalidateOnFocus: false,
        fetcher: (path, init) =>
          fetch(`/api/${path}`, init).then((res) => res.json()),
      }}
    >
      <Layout title="IP Blocking with Datadome" path="ip-blocking-datadome">
        <Component {...pageProps} />
      </Layout>
    </SWRConfig>
  )
}
