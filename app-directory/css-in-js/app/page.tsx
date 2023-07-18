import { Page, Text, Link, Code, Snippet } from '@vercel/examples-ui'

export default function Home() {
  return (
    <Page className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <Text variant="h1">CSS-in-JS within app dir</Text>
        <Text>
          CSS-in-JS libraries often have a provider component that needs to wrap
          your entire application, we&apos;ll explore how to do this with a{' '}
          <Code>Providers</Code> client component that wraps our app. Although
          client components can&apos;t include server components, we can have a
          client component with server components as children.
        </Text>
      </section>

      <section className="flex flex-col gap-4">
        <Text variant="h2">Getting Started</Text>
        <Text>
          we&apos;ll create a root layout for our app that will wrap its
          children with the <Code>Providers</Code> component. And a page server
          component that will use client components from the Chakra UI library.
        </Text>
        <pre className="border border-accents-2 rounded-md bg-accents-1 overflow-x-auto p-6">{`|/app
|__/layout.js (client)
|__/page.js (server)
|__/providers.js (client)
`}</pre>
        <Snippet>
          {`// app/providers.js
'use client'

import { ChakraProvider } from '@chakra-ui/react'

const Providers = ({ children }) => (
  <ChakraProvider>{children}</ChakraProvider>
)

export default Providers
`}
        </Snippet>
        <Snippet>
          {`// app/layout.js
import { Page } from '@vercel/examples-ui'
import Providers from './providers'

const RootLayout = ({ children }) => (
  <Page className="flex flex-col gap-6">
    <Providers>{children}</Providers>
  </Page>
)

export default RootLayout
`}
        </Snippet>
        <Text>
          After setting up Chakra in the layout component, we can now use some
          of its components in the page:
        </Text>
        <Snippet>
          {`// app/page.js

import { Text } from '@vercel/examples-ui'
import { Buttons, Tabs, Skeletons } from './showcase'

const IndexPage = () => (
  <section className="flex flex-col gap-6">
    <article className="flex flex-col gap-3">
      <Text variant="h2">Buttons</Text>
      <Buttons />
    </article>
    <article className="flex flex-col gap-3">
      <Text variant="h2">Tabs</Text>
      <Tabs />
    </article>
    <article className="flex flex-col gap-3">
      <Text variant="h2">Skeleton</Text>
      <Skeletons />
    </article>
  </section>
)

export default IndexPage
`}
        </Snippet>
        <Text>
          This way, your layout and page components are still server components,
          where you can fetch data from the server, and more.
        </Text>
      </section>

      <section className="flex flex-col gap-4">
        <Text variant="h2">Demo</Text>
        <Text>
          <Link href="/demo">Click here to see a working demo</Link>.
        </Text>
      </section>
    </Page>
  )
}
