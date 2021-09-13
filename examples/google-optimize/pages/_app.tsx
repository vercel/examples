import type { FC } from 'react'
import type { AppProps } from 'next/app'

const Noop: FC = ({ children }) => <>{children}</>

export default function MyApp({ Component, pageProps }: AppProps) {
  const Layout = (Component as any).Layout || Noop

  return (
    <Layout pageProps={pageProps}>
      <Component {...pageProps} />
    </Layout>
  )
}
