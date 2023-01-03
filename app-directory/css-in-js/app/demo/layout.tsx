import { Page } from '@vercel/examples-ui'

import Providers from './providers'

interface Props {
  children: React.ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <Page className="flex flex-col gap-6">
      <Providers>{children}</Providers>
    </Page>
  )
}
