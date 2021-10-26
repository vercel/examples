import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/edge-functions-ui/layout'
import { getLayout } from '@vercel/edge-functions-ui'
import '@vercel/edge-functions-ui/globals.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout
      title="JWT Authentication"
      path="jwt-authentication"
      deployButton={{ env: ['JWT_SECRET_KEY'] }}
    >
      <Component {...pageProps} />
    </Layout>
  )
}
