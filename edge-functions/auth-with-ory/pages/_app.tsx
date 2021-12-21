import { getLayout } from '@vercel/edge-functions-ui'
import '@vercel/edge-functions-ui/globals.css'
import type { LayoutProps } from '@vercel/edge-functions-ui/layout'
import type { AppProps } from 'next/app'

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)
  console.log('layout', Layout)

  return (
    <Layout
      title="Add login and registration to your Next.js app!"
      path="Auth, Login, Registration with Ory"
      deployButton={{
        repositoryUrl:
          'https://github.com/vercel/examples/tree/main/solutions/auth-with-ory'
      }}
    >
      <Component {...pageProps} />
    </Layout>
  )
}

export default App
