import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'

import { getLayout } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout
      title="Static tweets with Tailwind"
      path="solutions/static-tweets-tailwind"
      description="How to generate static tweets using Tailwind CSS & Next.js."
    >
      <Component {...pageProps} />
    </Layout>
  )
}

export default App
