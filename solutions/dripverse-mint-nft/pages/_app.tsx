import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'

import { getLayout } from '@vercel/examples-ui'

import '@vercel/examples-ui/globals.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

const queryClient = new QueryClient()

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout
      title="dripverse-mint-nft"
      path="solutions/dripverse-mint-nft"
      description="dripverse-mint-nft"
      deployButton={{
        env: [
          'NEXT_PUBLIC_DRIPVERSE_PROJECT_KEY',
          'NEXT_PUBLIC_NFT_STORAGE_API_KEY',
        ],
        projectName: 'my-dripverse-test-project',
        repositoryName: 'my-dripverse-test-project',
      }}
    >
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
      <Toaster position="bottom-center" />
    </Layout>
  )
}

export default App
