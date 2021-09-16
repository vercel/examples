import type { FC } from 'react'
import { ConfigcatProvider } from '@lib/use-configcat'
import { Page } from '.'

const ConfigcatLayout: FC = ({ children }) => {
  return (
    <Page>
      <ConfigcatProvider>{children}</ConfigcatProvider>
    </Page>
  )
}

export default ConfigcatLayout
