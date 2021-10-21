import Head from 'next/head'
import { getLayout, Text } from '@edge-functions/ui'

import map from '../public/map.svg'

import '@edge-functions/ui/globals.css'

export default function App({ Component, pageProps }) {
  const Layout = getLayout(Component)

  return (
    <>
      <Head>
        <title>Vercel Edge Functions Demo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout {...pageProps}>
        <main style={{backgroundImage: `url(${map.src})`}}>
          <div className="text-center mb-6 flex flex-col items-center w-full max-w-xl mx-auto pt-16">
            <Text variant="h1" className="mb-4">
              Edge Functions
            </Text>
            <Text>
              Dynamic content close to your users.
            </Text>
            <a
              className="flex items-center mt-2 text-md sm:text-lg text-blue-500 hover:underline"
              href="https://vercel.com/docs"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Documentation
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                stroke="currentColor"
                className="ml-1"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                shapeRendering="geometricPrecision"
              >
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          <div className="w-full max-w-xl mx-auto">
            <Component {...pageProps} />
          </div>
        </main>
      </Layout>
    </>
  )
}
