import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'
import Image from 'next/image'
import { getLayout, Text } from '@vercel/examples-ui'

import map from '../public/map.svg'

import '@vercel/examples-ui/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout
      title="Power parity pricing strategies"
      path="edge-middleware/power-parity-pricing-strategies"
    >
      <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
        <div className="fixed inset-0 overflow-hidden opacity-75 bg-[#f8fafb]">
          <Image
            alt="World Map"
            src={map}
            layout="fill"
            objectFit="cover"
            quality={100}
          />
        </div>
        <main className="flex flex-col items-center flex-1 px-4 sm:px-20 w-full text-center z-10 py-8 sm:py-20">
          <Text variant="h1" className="mb-4">
            Edge Middleware
          </Text>
          <Text>Dynamic content close to your users.</Text>
          <a
            className="flex items-center mt-2 text-md sm:text-lg text-blue-500 hover:underline"
            href="https://vercel.com/docs"
            target="_blank"
            rel="noreferrer"
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
          <div className="w-full max-w-xl mx-auto">
            <Component {...pageProps} />
          </div>
        </main>
      </div>
    </Layout>
  )
}
