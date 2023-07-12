import '@vercel/examples-ui/globals.css'
import Vercel from '../components/vercel-icon'
import Nav from '../components/nav'

export const metadata = {
  title: 'feature-flag-split - Vercel Examples',
  description: 'An example showing how to use Vercel with Split.io',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const path = 'edge-middleware/feature-flag-split'
  return (
    <html lang="en">
      <body>
        <div className="mx-auto h-screen flex flex-col">
          <Nav
            path={path}
            deployButton={{
              customDeployUrl:
                'https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/feature-flag-split&env=SPLIT_SDK_CLIENT_API_KEY,EDGE_CONFIG,EDGE_CONFIG_SPLIT_ITEM_KEY&project-name=feature-flag-split&repository-name=feature-flag-split&integration-ids=oac_bic40oWF5k9pDFboJhKYqMd1&edge-config-stores=%7B%22EDGE_CONFIG%22%3A%7B%7D%7D',
            }}
          />

          <div className="px-8 bg-accents-0">{children}</div>

          <footer className="py-10 w-full mt-auto border-t flex items-center justify-center bg-accents-1 z-20">
            <span className="text-primary">Created by</span>
            <a
              href="https://vercel.com"
              aria-label="Vercel.com Link"
              target="_blank"
              rel="noreferrer"
              className="text-black"
            >
              <Vercel
                className="inline-block h-6 ml-3 text-primary"
                alt="Vercel.com Logo"
              />
            </a>
          </footer>
        </div>
      </body>
    </html>
  )
}
