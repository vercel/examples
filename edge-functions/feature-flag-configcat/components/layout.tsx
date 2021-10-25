import type { FC } from 'react'
import { Layout, Page } from '@vercel/edge-functions-ui'
import type { LayoutProps } from '@vercel/edge-functions-ui/layout'
import { ConfigcatProvider } from '@lib/use-configcat'

const ConfigcatLayout: FC<LayoutProps> = ({ children, ...props }) => {
  return (
    <Layout {...props}>
      <Page>
        <ConfigcatProvider>{children}</ConfigcatProvider>
      </Page>
    </Layout>
  )
}

export default ConfigcatLayout
