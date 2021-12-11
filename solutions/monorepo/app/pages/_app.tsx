import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/edge-functions-ui/layout'
import { getLayout } from '@vercel/edge-functions-ui'
import '../styles/globals.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout
      title="Monorepo"
      path="monorepo"
      deployButton={{
        repositoryUrl:
          'https://github.com/vercel/examples/tree/main/solutions/reduce-image-bandwidth-usage',
      }}
    >
      <Component {...pageProps} />
    </Layout>
  )
}
