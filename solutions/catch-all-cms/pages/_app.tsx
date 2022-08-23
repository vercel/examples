import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'
import { getLayout } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'
import { RenderCMSComponent } from 'components'

function App({ Component, pageProps }: AppProps) {
  // Layout for pages/[..slug].tsx
  if (pageProps.layout) {
    return (
      <RenderCMSComponent
        component={pageProps.layout}
        rootProps={{ children: <Component {...pageProps} /> }}
      />
    )
  }

  // Handle the layout for pages/index.tsx
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout
      title="catch-all-cms"
      path="solutions/catch-all-cms"
      description="catch-all-cms"
    >
      <Component {...pageProps} />
    </Layout>
  )
}

export default App
