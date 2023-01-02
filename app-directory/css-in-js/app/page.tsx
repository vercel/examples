import { Page, Text, Link, Code, Snippet } from '@vercel/examples-ui'

export default function Home() {
  return (
    <Page className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <Text variant="h1">CSS-in-JS within app dir</Text>
        <Text>
          CSS-in-JS libraries often have a provider component that needs to wrap
          our entire application. You can make your root layout (or your
          outermost component you need to be wrapped by your library provider) a
          client component and wrap it with the provider.
        </Text>
        <Text>
          Althought client components can&apos;t include server components, we
          can have a client layout rendering a page from the server. This allows
          us to wrap our application within a provider component while allowing
          us to fetch information from the server on our routes.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Text variant="h2">Creating the files</Text>
        <Text>
          We will create a root layout (client) for our app that will wrap its
          children with a provider component. And a page (server) that will use
          client components from the library.
        </Text>
        <pre className="border border-accents-2 rounded-md bg-accents-1 overflow-x-auto p-6">{`|/app
|__/layout.js (client)
|__/page.js (server)
`}</pre>
        <Snippet>
          {`// app/layout.js
'use client'

import { Link, Page, Text } from '@vercel/examples-ui'
import {
  ChakraProvider,
  Divider,
  extendTheme,
  Select,
  theme as defaultTheme,
} from '@chakra-ui/react'
import { useMemo, useState } from 'react'

export default function RootLayout({ children }) {
  const [color, setColor] = useState('blue')
  const theme = useMemo(
    () => extendTheme({ colors: { brand: defaultTheme.colors[color] } }),
    [color]
  )

  return (
    <ChakraProvider theme={theme}>
      <Text variant="h2">Brand color</Text>
      <Select onChange={setColor}>
        <option value="blue">Blue</option>
        <option value="red">Red</option>
        <option value="green">Green</option>
      </Select>
      <Divider />
      {children}
    </ChakraProvider>
  )
}`}
        </Snippet>
        <Text>
          Now, use some components from the library in our page component.
        </Text>
        <Snippet>
          {`// app/page.js
import { Text } from '@vercel/examples-ui'
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
          This way, your page component is still a server component, where you
          can fetch data from the server, and more.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Text variant="h2">Demo</Text>
        <Text>
          Now you will be able to fetch information from the server althought
          your app is wrapped by the library provider, you can see a working
          demo <Link href="/demo">here</Link>.
        </Text>
      </section>
    </Page>
  )
}
