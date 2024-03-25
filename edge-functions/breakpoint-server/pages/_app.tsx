import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'
import { getLayout } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'
import { BreakpointProvider } from '../hooks/use-breakpoint/use-breakpoint'
import { BreakpointServer } from '../config/breakpoints'

export default function MyApp({
  Component,
  pageProps,
  router: {
    query: {
      breakpoint 
    }
  }
}: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <BreakpointProvider initialBreakpoint={breakpoint as BreakpointServer}>
      <Layout path="edge-functions/i18n">
        <Component {...pageProps} />
      </Layout>
    </BreakpointProvider>
  )
}
