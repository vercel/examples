import type { FC, ReactNode } from 'react'
import { Page } from '@vercel/examples-ui'
import Providers from './providers'

const RootLayout: FC<{ children: ReactNode }> = ({ children }) => (
  <Page className="flex flex-col gap-6">
    <Providers>{children}</Providers>
  </Page>
)

export default RootLayout
