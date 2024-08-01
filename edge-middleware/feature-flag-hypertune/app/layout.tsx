import type { ReactNode } from 'react'
import { Layout, getMetadata } from '@vercel/examples-ui'
import { VercelToolbar } from '@vercel/toolbar/next'
import { HypertuneProvider } from '../generated/hypertune.react'
import '@vercel/examples-ui/globals.css'
import getHypertune from '../lib/getHypertune'

export const metadata = getMetadata({
  title: 'feature-flag-hypertune',
  description: 'An example showing how to use Hypertune with Vercel.',
})

export const runtime = 'edge'

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const hypertune = await getHypertune()

  const serverDehydratedState = hypertune.dehydrate()
  const serverRootArgs = hypertune.getRootArgs()

  return (
    <HypertuneProvider
      createSourceOptions={{
        token: process.env.NEXT_PUBLIC_HYPERTUNE_TOKEN!,
      }}
      dehydratedState={serverDehydratedState}
      rootArgs={serverRootArgs}
    >
      <html lang="en">
        <body>
          <Layout
            path="edge-middleware/feature-flag-hypertune"
            deployButton={{
              customDeployUrl:
                'https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fhypertunehq%2Fvercel-examples-fork%2Ftree%2Fmain%2Fedge-middleware%2Ffeature-flag-hypertune&env=NEXT_PUBLIC_HYPERTUNE_TOKEN,HYPERTUNE_ADMIN_TOKEN,EDGE_CONFIG,EDGE_CONFIG_HYPERTUNE_ITEM_KEY,FLAGS_SECRET&envDescription=Environment%20variables%20needed%20to%20use%20Hypertune%20with%20Vercel%20Edge%20Config%20and%20the%20Vercel%20Toolbar&envLink=https%3A%2F%2Fdocs.hypertune.com%2Fgetting-started%2Fvercel-quickstart&project-name=feature-flag-hypertune&repository-name=feature-flag-hypertune&demo-title=Hypertune%20with%20Vercel&demo-description=Use%20Hypertune%20with%20Vercel%20Edge%20Config%20and%20the%20Vercel%20Toolbar&demo-url=https%3A%2F%2Ffeature-flag-hypertune.vercel.app%2F&demo-image=https%3A%2F%2Ffeature-flag-hypertune.vercel.app%2Fdemo.png&integration-ids=oac_naLXREDG2o9KihTGYBVz9fVl',
            }}
          >
            {children}
            <VercelToolbar />
          </Layout>
        </body>
      </html>
    </HypertuneProvider>
  )
}
