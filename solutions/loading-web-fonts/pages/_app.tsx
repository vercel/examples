import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'
import { getLayout } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'
/**
 * Load a custom fallback font that we use in the example, you don't need to add
 * a fallback font if the default fallback font added by Next.js is good enough.
 *
 * You can use it like this:
 *
 * ```js
 *  const inter = Inter({
 *    variable: '--inter-font',
 *    display: 'swap',
 *    fallback: ['Inter-fallback'],
 *    adjustFontFallback: false,
 *  })
 * ```
 */
import '../globals.css'

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout
      title="Loading web fonts"
      path="solutions/loading-web-fonts"
      description="How to correctly load web fonts"
    >
      <Component {...pageProps} />
    </Layout>
  )
}

export default App
