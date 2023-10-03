import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'
import { Analytics } from '@vercel/analytics/react'

import { getLayout } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout
      title="Vercel Cron Job Example"
      deployButton={{
        customDeployUrl:
          'https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fsolutions%2Fcron&project-name=cron&repository-name=cron&demo-title=Vercel%20Cron%20Job%20Example&demo-description=A%20Next.js%20app%20that%20uses%20Vercel%20Cron%20Jobs%20to%20update%20data%20at%20different%20intervals.&demo-url=https%3A%2F%2Fcron-template.vercel.app%2F&demo-image=https%3A%2F%2Fcron-template.vercel.app%2Fthumbnail.png&integration-ids=oac_V3R1GIpkoJorr6fqyiwdhl17',
      }}
      path="solutions/cron"
      description="How to use Vercel Cron Jobs to update data at different intervals"
    >
      <Component {...pageProps} />
      <Analytics />
    </Layout>
  )
}

export default App
