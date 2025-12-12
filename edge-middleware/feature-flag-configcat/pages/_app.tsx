import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'
import { getLayout, Head } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout
      path="feature-flag-configcat"
      deployButton={{ env: ['NEXT_PUBLIC_CONFIGCAT_SDK_KEY'] }}
    >
      <Head title="AB testing with ConfigCat" />
      <Component {...pageProps} />
    </Layout>
  )
}
