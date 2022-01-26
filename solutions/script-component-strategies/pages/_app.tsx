import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'

import Link from 'next/link'

import { getLayout } from '@vercel/examples-ui'

import '@vercel/examples-ui/globals.css'

function App({ Component, pageProps, router }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)
  const pathname = router.pathname

  return (
    <Layout
      title="next/image offset example"
      path="solutions/script-component-strategies"
    >
      <Component {...pageProps} />
      {pathname !== '/' && (
        <>
          <hr className="border-t border-accents-2 my-2" />
          <footer className="w-full max-w-3xl mx-auto py-4 mb-2">
            <Link href="/">
              <a>See all examples</a>
            </Link>
          </footer>
        </>
      )}
    </Layout>
  )
}

export default App
