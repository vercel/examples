import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'
import { getLayout } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout
      title="AB testing with Firebase remote config"
      path="edge-middleware/feature-flag-firebase-remote-config"
      deployButton={{
        env: [
          'PRIVATE_KEY_ID',
          'PRIVATE_KEY',
          'CLIENT_EMAIL',
          'CLIENT_ID',
          'AUTH_URI',
          'TOKEN_URI',
          'AUTH_PROVIDER_X509_CERT_URL',
          'CLIENT_X509_CERT_URL',
        ],
      }}
    >
      <Component {...pageProps} />
    </Layout>
  )
}
