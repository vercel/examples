'use client'

import { Link, Page, Text } from '@vercel/examples-ui'
import { CounterProvider, useCounter } from './providers'

interface Props {
  children: React.ReactNode
}

function RootLayout({ children }: Props) {
  const [counter] = useCounter()

  return (
    <Page className="flex flex-col gap-12">
      <nav className="flex gap-4">
        <Link href="/demo">Index</Link>
        <Link href="/demo/nested">Nested</Link>
      </nav>
      {children}
      <section className="flex flex-col gap-3">
        <Text variant="h2">Counter</Text>
        <Text className="text-3xl font-black">{counter}</Text>
      </section>
      <section className="flex flex-col gap-3">
        <Link href="/">← Back to example</Link>
      </section>
    </Page>
  )
}

export default function RootLayoutContainer(props: Props) {
  return (
    <CounterProvider>
      <RootLayout {...props} />
    </CounterProvider>
  )
}
