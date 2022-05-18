import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'

import { getLayout } from '@vercel/examples-ui'

import '@vercel/examples-ui/globals.css'

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout
      title="Pagination with SSG"
      path="solutions/pagination-with-ssg"
      description="Learn how to do pagination with SSG"
    >
      <Component {...pageProps} />
    </Layout>
  )
}

export default App
