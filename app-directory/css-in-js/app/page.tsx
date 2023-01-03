import { Page, Text, Link, Code, Snippet } from '@vercel/examples-ui'

export default function Home() {
  return (
    <Page className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <Text variant="h1">CSS-in-JS within app dir</Text>
        <Text>
          CSS-in-JS libraries often have a provider component that needs to wrap
          our entire application. You can make a <Code>Providers</Code> client
          component and wrap your app with it. Althought client components
          can&apos;t include server components, we can have a client component
          with server components as children.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Text variant="h2">Getting Started</Text>
        <Text>
          We will create a root layout for our app that will wrap its children
          with the <Code>Providers</Code> component. And a page server component
          that will use client components from the Chakra UI library.
        </Text>
        <pre className="border border-accents-2 rounded-md bg-accents-1 overflow-x-auto p-6">{`|/app
|__/layout.js
|__/page.js
|__/providers.js
`}</pre>
        <Snippet>
          {`// app/providers.js
'use client'

import { ChakraProvider } from '@chakra-ui/react'

export default function Providers({ children }) {
  return (
    <ChakraProvider>
      {children}
    </ChakraProvider>
  )
}
`}
        </Snippet>
        <Snippet>
          {`// app/layout.js
import Providers from './providers'

export default function RootLayout({ children }) {
  return (
    <Providers>
      {children}
    </Providers>
  )
}`}
        </Snippet>
        <Text>
          After setting up Chakra in the layout component, we can now use some
          of its components in the page:
        </Text>
        <Snippet>
          {`// app/page.js

// Assume that the following components are client components
import { Buttons, Tabs, Skeletons } from "./showcase"

export default function IndexPage() {
  return (
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
}
`}
        </Snippet>
        <Text>
          This way, your layout and page components are still server components,
          where you can fetch data from the server, and more.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Text variant="h2">Demo</Text>
        <Link href="/demo">Click here to see a working demo</Link>
      </section>
    </Page>
  )
}
