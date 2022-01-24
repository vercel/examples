import type { FC } from 'react'
import { Layout, Page } from '@vercel/examples-ui'
import type { LayoutProps } from '@vercel/examples-ui/layout'
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
