import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'
import { getLayout } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout
      title="JWT Authentication"
      path="edge-functions/jwt-authentication"
      deployButton={{ env: ['JWT_SECRET_KEY'] }}
    >
      <Component {...pageProps} />
    </Layout>
  )
}
