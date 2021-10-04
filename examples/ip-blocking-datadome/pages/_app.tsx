import { FC } from 'react'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Head, Layout as DefaultLayout } from '@components/common'
import { SWRConfig } from 'swr'

// const Noop: FC = ({ children }) => <>{children}</>

export default function MyApp({ Component, pageProps }: AppProps) {
  const Layout = (Component as any).Layout || DefaultLayout
  return (
    <SWRConfig
      value={{
        refreshInterval: 40000,
        revalidateOnFocus: false,
        fetcher: (path, init) =>
          fetch(`/api/${path}`, init).then((res) => res.json()),
      }}
    >
      <Head />
      <Layout pageProps={pageProps}>
        <Component {...pageProps} />
      </Layout>
    </SWRConfig>
  )
}
